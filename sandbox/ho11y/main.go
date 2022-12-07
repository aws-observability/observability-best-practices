package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/bitly/go-simplejson"
	"github.com/catalint/datasize"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gorilla/mux/otelmux"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/contrib/propagators/aws/xray"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp"
	"go.opentelemetry.io/otel/exporters/otlp/otlpgrpc"
	controller "go.opentelemetry.io/otel/sdk/metric/controller/basic"
	processor "go.opentelemetry.io/otel/sdk/metric/processor/basic"
	"go.opentelemetry.io/otel/sdk/metric/selector/simple"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/semconv"
	"go.opentelemetry.io/otel/trace"
)

var (
	// downstreams are the URLs of the services to be invoked when this
	// ho11y instance is invoked
	downstreams = []string{"", "", "", "", ""}
	// invokeCounter is a Prometheus counter incremented when this
	// ho11y instance is invoked
	invokeCounter = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "ho11y_total",
			Help: "Total ho11y invokes.",
		},
		[]string{"http_status_code"},
	)
	// randGauge is a Prometheus gauge randomly set by randValues()
	randGauge = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "ho11y_randval",
			Help: "A random value.",
		})
	// randHistogram is a Prometheus histogram randomly set by randValues()
	randHistogram = promauto.NewHistogram(
		prometheus.HistogramOpts{
			Name:    "ho11y_randhist",
			Help:    "A histogram of normally distributed random numbers.",
			Buckets: prometheus.LinearBuckets(-2, .5, 10),
		})
	// payloadsSummary is a Prometheus summary updated when this
	// ho11y instance is invoked
	payloadsSummary = prometheus.NewSummaryVec(
		prometheus.SummaryOpts{
			Name:       "ho11y_downstream_payload_bytes",
			Help:       "HTTP body size received from a downstream.",
			Objectives: map[float64]float64{},
		},
		[]string{"downstream"},
	)
	// payloadsHistogram is a Prometheus histogram updated when this
	// ho11y instance is invoked
	payloadsHistogram = prometheus.NewHistogram(
		prometheus.HistogramOpts{
			Name:    "ho11y_downstream_duration_seconds",
			Help:    "Duration taken for invoking a downstream.",
			Buckets: prometheus.ExponentialBuckets(0.0001, 2, 10),
		})
	// tracer is the OpenTelemetry tracer used
	tracer = otel.Tracer("ho11y")
	// responseCodes are the various failure HTTP status code used
	// in failure injection mode
	responseCodes = []int{
		http.StatusBadRequest,
		http.StatusForbidden,
		http.StatusMovedPermanently,
		http.StatusNotFound,
		http.StatusNotImplemented,
	}
	// enableThrottling is true if a valid HO11Y_CUTOFF_TPS env variable os
	// set and hence we apply request throttling
	enableThrottling bool
	// tpsCutoffVal represents the (user-provided) cutoff value for the TPS,
	// that is, above this value a 429 HTTP response code is returned
	tpsCutoffVal float64
	// tpsValue has the current TPS value (globally); it is write-only for
	// the HTTP handler and read-only for the throttle handler (Go routine)
	tpsValue float64
	// invokesInPeriod counts the number of invokes in the measurement period
	invokesInPeriod int
)

// randValues sets various Prometheus metrics to random values
func randValues() {
	for {
		randGauge.Set(rand.NormFloat64())
		randHistogram.Observe(rand.NormFloat64())
		time.Sleep(5 * time.Second)
	}
}

// handleErr prints an error message to stdout and exits
func handleErr(err error, message string) {
	if err != nil {
		log.Error("%s: %v", message, err)
		os.Exit(1)
	}
}

// initProvider configures the OTEL collector connection
func initProvider() {
	ctx := context.Background()
	endpoint := os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	if endpoint == "" {
		endpoint = "0.0.0.0:55680"
	}
	log.Info("Using Otel collector at " + endpoint)
	driver := otlpgrpc.NewDriver(
		otlpgrpc.WithInsecure(),
		otlpgrpc.WithEndpoint(endpoint),
		//otlpgrpc.WithDialOption(grpc.WithBlock()),
	)
	exporter, err := otlp.NewExporter(ctx, driver)
	handleErr(err, "Failed to create new OTLP exporter")

	svcattrib := os.Getenv("OTEL_RESOURCE_ATTRIB")
	if svcattrib == "" {
		svcattrib = "ho11y-svc"
	}
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceNameKey.String(svcattrib),
		),
	)
	handleErr(err, "Failed to create resource "+svcattrib)

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithConfig(sdktrace.Config{
			DefaultSampler: sdktrace.AlwaysSample(),
		}),
		sdktrace.WithResource(res),
		sdktrace.WithSyncer(exporter),
		sdktrace.WithIDGenerator(xray.NewIDGenerator()),
	)
	cont := controller.New(
		processor.New(
			simple.NewWithExactDistribution(),
			exporter,
		),
		controller.WithPusher(exporter),
		controller.WithCollectPeriod(2*time.Second),
	)
	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(xray.Propagator{})
	_ = cont.Start(ctx)
}

// getXrayTraceID extracts the X-Ray trace ID from a span
func getXrayTraceID(span trace.Span) string {
	xrayTraceID := span.SpanContext().TraceID.String()
	result := fmt.Sprintf("1-%s-%s", xrayTraceID[0:8], xrayTraceID[8:])
	return result
}

// invoke calls a downstream and returns the result including
// stats such as size and duration of the invocation
func invoke(ctx context.Context, URL string) (body string, size int, invoketime time.Duration) {
	client := http.Client{
		Transport: otelhttp.NewTransport(http.DefaultTransport),
	}
	req, _ := http.NewRequestWithContext(ctx, "GET", URL, nil)
	res, err := client.Do(req)
	handleErr(err, "HTTP GET to "+URL+" failed")
	start := time.Now()
	payload, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Debugf("Can't invoke downstream %v", err)
	}
	defer res.Body.Close()
	body = string(payload)
	size = len(body)
	invoketime = time.Now().Sub(start)
	return body, size, invoketime
}

// invokeDownstreams iterates over the downstreams provided and
// performs an HTTP GET on each of them as well as emits signals
// along the way
func invokeDownstreams(ctx context.Context) {
	for _, downstream := range downstreams {
		var body string
		var size int
		var invokePeriod time.Duration
		if downstream != "" {
			// handle dummy downstreams (that is, pre-configured, deterministic responses)
			// format is:
			//            DUMMY:$BODY_SIZE:$INVOKE_DURATION
			// for example:
			//            DUMMY:187kB:42ms
			// would simulate a downstream that returned 187kB payload in 42ms.
			switch {
			case strings.HasPrefix(downstream, "DUMMY"):
				d := strings.Split(downstream, ":")
				var s datasize.ByteSize
				err := s.UnmarshalText([]byte(d[1]))
				if err != nil {
					log.Debugf("Can't parse dummy's invoke configuration: %v", err)
				}
				size = int(s)
				p, err := time.ParseDuration(d[2])
				if err != nil {
					log.Debugf("Can't parse dummy's invoke configuration (have to use Go duration syntax): %v", err)
				}
				invokePeriod = p
				time.Sleep(invokePeriod)
			default:
				body, size, invokePeriod = invoke(ctx, downstream)
				_ = body
			}
			// log:
			log.WithFields(
				log.Fields{
					"event":        "downstream",
					"body_bytes":   size,
					"duration_sec": invokePeriod.Seconds(),
				},
			).Info("ho11y invoked " + downstream)
			// metrics:
			v := float64(size)
			payloadsSummary.WithLabelValues(downstream).Observe(v)
			traceid := getXrayTraceID(trace.SpanFromContext(ctx))
			payloadsHistogram.(prometheus.ExemplarObserver).ObserveWithExemplar(
				float64(invokePeriod.Seconds()),
				prometheus.Labels{"traceid": traceid},
			)
		}
	}
}

// handler is the main ho11y service function, returning the current
// trace ID and also supporting a failure injection mode (dropping requests)
func handler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	traceid := getXrayTraceID(trace.SpanFromContext(ctx))

	// if enabled, we first handle throttling. if the current TPS value
	// is larger than what user told us to, return a 429 and call it a day.
	// we always need to increment the period counter for throttling:
	if enableThrottling {
		invokesInPeriod += 1
		if tpsValue > tpsCutoffVal {
			w.WriteHeader(http.StatusTooManyRequests)
			invokeCounter.WithLabelValues(strconv.Itoa(http.StatusTooManyRequests)).Inc()
			log.Info(fmt.Sprintf("Throttle engaged, got %v TPS with a %v TPS cutoff point", tpsValue, tpsCutoffVal))
			return
		}
	}

	// next, if failure injection is enabled, then we
	// generate a random value (range: 0 to 100)
	// and if this one is above a fixed threshold (50)
	// then we drop the request with a randomly selected
	// status code, bastard-operator-from-hell style.
	// result: in average only half of the requests
	// are successfully served:
	if os.Getenv("HO11Y_INJECT_FAILURE") != "" {
		threshold := 50
		level := rand.Intn(100)
		if level > threshold {
			// now pick a random failure HTTP status code:
			rc := responseCodes[rand.Intn(len(responseCodes))]
			w.WriteHeader(rc)
			invokeCounter.WithLabelValues(strconv.Itoa(rc)).Inc()
			return
		}
	}

	// if we are below the threshold, respond successfully
	// that is with HTTP 200 status code:
	w.Header().Set("Content-Type", "application/json")

	// emit log event for invocation:
	log.WithFields(
		log.Fields{
			"event":   "invoke",
			"traceID": traceid,
			"remote":  r.RemoteAddr,
		},
	).Info("ho11y was invoked")

	// increment counter metric for invocation:
	invokeCounter.WithLabelValues(strconv.Itoa(http.StatusOK)).Inc()

	// emit trace(s) for invocation:
	json := simplejson.New()
	json.Set("traceId", traceid)
	invokeDownstreams(ctx)
	payload, _ := json.MarshalJSON()

	_, _ = w.Write(payload)
}

// manageThrottle handles throttle tracking bt calculating the current TPS
func manageThrottle() {
	const throttlePeriodMilliseconds = 500
	throttlePeriod := time.Duration(throttlePeriodMilliseconds * time.Millisecond)
	for {
		tpsValue = float64(invokesInPeriod) / throttlePeriod.Seconds()
		invokesInPeriod = 0
		time.Sleep(throttlePeriod)
	}
}

func main() {
	// configure log in JSON format:
	log.SetFormatter(&log.JSONFormatter{})
	logdest, ldprovided := os.LookupEnv("HO11Y_LOG_DEST")
	if ldprovided {
		switch logdest {
		case "stdout":
			log.SetOutput(os.Stdout)
		default:
			log.SetOutput(os.Stderr)
		}
	}
	// make sure to provide random values:
	rand.Seed(time.Now().UTC().UnixNano())
	// handle service port setting from environment:
	port := ":8765"
	useport, pprovided := os.LookupEnv("HO11Y_PORT")
	if pprovided {
		port = ":" + useport
	}
	// handle injection mode setting from environment:
	if os.Getenv("HO11Y_INJECT_FAILURE") != "" {
		log.Info("Failure injection enabled, dropping half of the requests")
	}
	// handle downstream settings from environment:
	for i := range downstreams {
		downstreams[i] = os.Getenv("DOWNSTREAM" + strconv.Itoa(i))
		if downstreams[i] != "" {
			log.Info("Using downstream " + strconv.Itoa(i) + ": " + downstreams[i])
		}
	}
	// handle throttle setting from environment:
	enableThrottling = false
	tpv, tprovided := os.LookupEnv("HO11Y_CUTOFF_TPS")
	if tprovided {
		parsedval, err := strconv.Atoi(tpv)
		if err == nil {
			tpsCutoffVal = float64(parsedval)
			enableThrottling = true
			go manageThrottle()
			log.Info("Throttling enabled with a " + tpv + " TPS cutoff point")
		} else {
			log.Error("Invalid cutoff TPS value provided")
		}
	}

	// need to explicitly register those bad dawgs:
	prometheus.MustRegister(payloadsSummary)
	prometheus.MustRegister(payloadsHistogram)
	// kick off randomized metrics:
	go randValues()
	// configure OTEL tracing:
	initProvider()
	log.Info("Init instrumentation done")
	// set up HTTP API and launch service:
	exposeOpenMetrics := true
	_, omprovided := os.LookupEnv("DISABLE_OM")
	if omprovided {
		exposeOpenMetrics = false
		log.Info("OpenMetrics disabled")
	}
	r := mux.NewRouter()
	r.Use(otelmux.Middleware("ho11y-svc"))
	r.HandleFunc("/", handler).Methods(http.MethodGet)
	r.Handle("/metrics", promhttp.HandlerFor(
		prometheus.DefaultGatherer,
		promhttp.HandlerOpts{
			EnableOpenMetrics: exposeOpenMetrics,
		},
	))
	ho11yinstance := os.Getenv("OTEL_RESOURCE_ATTRIB")
	if ho11yinstance == "" {
		ho11yinstance = "ho11y-svc"
	}
	log.Infof("Launching ho11y: I am [%s] listening on port %s on all local IPs.", ho11yinstance, port)
	log.Fatal(http.ListenAndServe(port, r))
}
