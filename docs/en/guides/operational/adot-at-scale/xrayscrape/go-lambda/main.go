package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/xray"
)

const (
	// Scrape window duration
	scrapeWindow = 1 * time.Minute

	// Message header for UDP
	header = `{"format": "json", "version": 1}`
)

func HandleRequest() (*string, error) {

	// Create an AWS Session
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-west-2"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	// Create an X-Ray client
	svc := xray.NewFromConfig(cfg)

	// Get current time
	now := time.Now()

	// Get start time
	start := now.Add(-scrapeWindow)

	// Get trace summaries
	input := &xray.GetTraceSummariesInput{
		StartTime: aws.Time(start),
		EndTime:   aws.Time(now),
	}

	summaries, err := svc.GetTraceSummaries(context.TODO(), input)
	if err != nil {
		panic(err)
	}

	// Extract trace IDs
	var traceIDs []*string
	for _, summary := range summaries.TraceSummaries {
		traceIDs = append(traceIDs, summary.Id)
	}

	var documents []*string

	// Process trace IDs in batches
	for len(traceIDs) > 0 {
		batch := traceIDs
		if len(traceIDs) > 5 {
			batch = traceIDs[:5]
		}

		// Get trace documents
		input := &xray.BatchGetTracesInput{
			TraceIds: aws.ToStringSlice(batch),
		}

		output, err := svc.BatchGetTraces(context.TODO(), input)
		if err != nil {
			panic(err)
		}

		// Extract documents
		for _, trace := range output.Traces {
			documents = append(documents, trace.Segments[0].Document)
		}

		// Remove processed IDs
		traceIDs = traceIDs[len(batch):]
	}

	// Send documents via UDP to the otel collector ECS service that was created.
	udpHost := os.Getenv("OTEL_COLLECTOR_HOST") + ":2000"
	fmt.Println("The otel collector host is: ", udpHost)
	addr, err := net.ResolveUDPAddr("udp", udpHost)
	if err != nil {
		panic(err)
	}
	conn, err := net.DialUDP("udp", nil, addr)
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	var buffer bytes.Buffer
	for _, doc := range documents {
		buffer.WriteString(header)
		buffer.WriteByte('\n')
		buffer.WriteString(*doc)

		conn.Write(buffer.Bytes())
		buffer.Reset()
	}

	message := "Sent " + fmt.Sprint(len(documents)) + " documents to the otel collector."
	return &message, nil
}

func main() {
	lambda.Start(HandleRequest)
}
