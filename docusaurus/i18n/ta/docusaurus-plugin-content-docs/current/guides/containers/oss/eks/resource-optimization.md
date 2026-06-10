# Kubernetes workloads-க்கான Resource Optimization சிறந்த நடைமுறைகள்
Kubernetes ஏற்றுக்கொள்ளல் தொடர்ந்து வேகமடைகிறது, பலர் microservice அடிப்படையிலான architectures-க்கு மாறுகின்றனர். ஆரம்ப கவனம் அப்ளிகேஷன்களை ஆதரிக்க புதிய cloud native architectures-ஐ வடிவமைத்து உருவாக்குவதில் இருந்தது. சூழல்கள் வளரும்போது, வாடிக்கையாளர்களிடமிருந்து resource allocation-ஐ optimize செய்வதில் கவனம் செலுத்தப்படுவதை காண்கிறோம். Resource optimization என்பது security-க்கு அடுத்ததாக operations team-கள் கேட்கும் இரண்டாவது முக்கியமான கேள்வி.
Kubernetes environments-ல் resource allocation-ஐ optimize செய்வது மற்றும் அப்ளிகேஷன்களை right-size செய்வது பற்றிய வழிகாட்டுதலைப் பார்ப்போம். இதில் managed node groups, self-managed node groups மற்றும் AWS Fargate-உடன் deploy செய்யப்பட்ட Amazon EKS-ல் இயங்கும் அப்ளிகேஷன்கள் அடங்கும்.

## Kubernetes-ல் அப்ளிகேஷன்களை Right-sizing செய்வதற்கான காரணங்கள்
Kubernetes-ல், resource right-sizing என்பது அப்ளிகேஷன்களில் resource specifications-ஐ அமைப்பதன் மூலம் செய்யப்படுகிறது. இந்த settings நேரடியாக பின்வருவனவற்றை பாதிக்கின்றன:

* Performance — சரியான resource specifications இல்லாமல் Kubernetes அப்ளிகேஷன்கள் resources-க்காக தன்னிச்சையாக போட்டியிடும், இது அப்ளிகேஷன் performance-ஐ பாதிக்கலாம்.
* Cost Optimization — அதிகமான resource specifications-உடன் deploy செய்யப்பட்ட அப்ளிகேஷன்கள் அதிக செலவுகள் மற்றும் குறைவாக பயன்படுத்தப்படும் infrastructure-ஐ விளைவிக்கும்.
* Autoscaling — Kubernetes Cluster Autoscaler மற்றும் Horizontal Pod Autoscaling செயல்பட resource specifications தேவை.

Kubernetes-ல் மிகவும் பொதுவான resource specifications [CPU மற்றும் memory requests மற்றும் limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) ஆகும்.

## Requests மற்றும் Limits

கண்டெய்னர் செய்யப்பட்ட அப்ளிகேஷன்கள் Kubernetes-ல் Pods ஆக deploy செய்யப்படுகின்றன. CPU மற்றும் memory requests மற்றும் limits Pod definition-இன் optional பகுதியாகும். CPU [Kubernetes CPUs](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) அலகுகளில் குறிப்பிடப்படுகிறது, memory bytes-ல் குறிப்பிடப்படுகிறது, பொதுவாக [mebibytes (Mi)](https://simple.wikipedia.org/wiki/Mebibyte) ஆக.

Request மற்றும் limits ஒவ்வொன்றும் Kubernetes-ல் வெவ்வேறு functions-ஐ செய்கின்றன மற்றும் scheduling மற்றும் resource enforcement-ஐ வெவ்வேறு விதமாக பாதிக்கின்றன.

## பரிந்துரைகள்
ஒரு அப்ளிகேஷன் உரிமையாளர் தங்கள் CPU மற்றும் memory resource requests-க்கு "சரியான" மதிப்புகளை தேர்வு செய்ய வேண்டும். ஒரு சிறந்த வழி development environment-ல் அப்ளிகேஷனை load test செய்து observability tooling பயன்படுத்தி resource usage-ஐ அளவிடுவது. இது உங்கள் நிறுவனத்தின் மிக முக்கியமான அப்ளிகேஷன்களுக்கு அர்த்தமுள்ளதாக இருக்கலாம், ஆனால் உங்கள் கிளஸ்டரில் deploy செய்யப்பட்ட ஒவ்வொரு containerized அப்ளிகேஷனுக்கும் சாத்தியமில்லை. Workloads-ஐ optimize செய்து right-size செய்ய உதவும் tools-ஐ பார்ப்போம்:

### Vertical Pod Autoscaler (VPA)
[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) என்பது Autoscaling special interest group (SIG)-க்கு சொந்தமான Kubernetes sub-project ஆகும். இது observed அப்ளிகேஷன் performance அடிப்படையில் Pod requests-ஐ தானாக அமைக்க வடிவமைக்கப்பட்டுள்ளது. VPA இயல்பாக [Kubernetes Metric Server](https://github.com/kubernetes-sigs/metrics-server) பயன்படுத்தி resource usage-ஐ சேகரிக்கிறது, ஆனால் data source ஆக Prometheus-ஐ பயன்படுத்த configure செய்யலாம்.
VPA-ல் அப்ளிகேஷன் performance-ஐ அளவிட்டு sizing recommendations செய்யும் recommendation engine உள்ளது. VPA recommendation engine-ஐ stand-alone ஆக deploy செய்யலாம், அதனால் VPA எந்த autoscaling actions-ஐயும் செய்யாது. ஒவ்வொரு அப்ளிகேஷனுக்கும் VerticalPodAutoscaler custom resource உருவாக்குவதன் மூலம் configure செய்யப்படுகிறது, VPA object-இன் status field-ஐ resource sizing recommendations-உடன் புதுப்பிக்கிறது.
உங்கள் கிளஸ்டரில் ஒவ்வொரு அப்ளிகேஷனுக்கும் VerticalPodAutoscaler objects உருவாக்கி JSON results-ஐ படித்து விளங்குவது scale-ல் சவாலானது. [Goldilocks](https://github.com/FairwindsOps/goldilocks) இதை எளிதாக்கும் ஒரு open source project ஆகும்.

### Goldilocks
Goldilocks என்பது Fairwinds-இன் open source project ஆகும், இது நிறுவனங்கள் தங்கள் Kubernetes அப்ளிகேஷன் resource requests-ஐ "சரியாக" பெற உதவ வடிவமைக்கப்பட்டுள்ளது. Goldilocks-இன் இயல்பு கட்டமைப்பு opt-in model ஆகும். goldilocks.fairwinds.com/enabled: true label-ஐ namespace-க்கு சேர்ப்பதன் மூலம் எந்த workloads monitor செய்யப்படுகின்றன என்பதை நீங்கள் தேர்வு செய்கிறீர்கள்.


![Goldilocks-Architecture](../../../../images/goldilocks-architecture.png)

Metrics Server worker nodes-ல் இயங்கும் Kubelet-லிருந்து resource metrics-ஐ சேகரித்து Vertical Pod Autoscaler பயன்படுத்த Metrics API மூலம் வெளிப்படுத்துகிறது. Goldilocks controller goldilocks.fairwinds.com/enabled: true label கொண்ட namespaces-ஐ watch செய்து அந்த namespaces-ல் உள்ள ஒவ்வொரு workload-க்கும் VerticalPodAutoscaler objects-ஐ உருவாக்குகிறது.

Resource recommendation-க்கு namespaces-ஐ enable செய்ய, கீழே உள்ள command-ஐ இயக்கவும்:

```
kubectl create ns javajmx-sample
kubectl label ns javajmx-sample goldilocks.fairwinds.com/enabled=true
```

Amazon EKS கிளஸ்டரில் goldilocks-ஐ deploy செய்ய, கீழே உள்ள command-ஐ இயக்கவும்:

```
helm repo add fairwinds-stable https://charts.fairwinds.com/stable
helm upgrade --install goldilocks fairwinds-stable/goldilocks --namespace goldilocks --create-namespace --set vpa.enabled=true
```

Goldilocks-dashboard port 8080-ல் dashboard-ஐ வெளிப்படுத்தும், resource recommendation-ஐ பெற அதை அணுகலாம். Dashboard-ஐ அணுக கீழே உள்ள command-ஐ இயக்கவும்:

```
kubectl -n goldilocks port-forward svc/goldilocks-dashboard 8080:80
```
பின்னர் உங்கள் browser-ல் http://localhost:8080 திறக்கவும்

![Goldilocks-Dashboard](../../../../images/goldilocks-dashboard.png)


Goldilocks வழங்கும் recommendations-ஐ பார்க்க sample namespace-ஐ பகுப்பாய்வு செய்வோம். Deployment-க்கான recommendations-ஐ பார்க்க முடியும்.
![Goldilocks-Recommendation](../../../../images/goldilocks-recommendation.png)

javajmx-sample workload-க்கான request & limit recommendations-ஐ காணலாம். ஒவ்வொரு Quality of Service (QoS)-ன் கீழ் உள்ள Current column தற்போது configure செய்யப்பட்ட CPU மற்றும் Memory request மற்றும் limits-ஐ குறிக்கிறது. Guaranteed மற்றும் Burstable column-கள் respective QoS-க்கு பரிந்துரைக்கப்பட்ட CPU மற்றும் Memory request limits-ஐ குறிக்கின்றன.

Resources-ஐ over provision செய்துள்ளோம் என்பதை தெளிவாக காணலாம், goldilocks CPU மற்றும் Memory request-ஐ optimize செய்ய recommendations செய்துள்ளது. Guaranteed QoS-க்கு CPU request மற்றும் limits 100m மற்றும் 300m-க்கு பதிலாக 15m மற்றும் 15m ஆகவும், Memory request மற்றும் limits 180Mi மற்றும் 300Mi-க்கு பதிலாக 105M மற்றும் 105M ஆகவும் பரிந்துரைக்கப்பட்டுள்ளன.
நீங்கள் ஆர்வமுள்ள QoS class-க்கான manifest file-ஐ copy செய்து right-sized மற்றும் optimized workloads-ஐ deploy செய்யலாம்.

### cAdvisor metric பயன்படுத்தி throttling-ஐ புரிந்துகொள்ளுதல் மற்றும் resource-ஐ சரியாக configure செய்தல்
Limits-ஐ configure செய்யும்போது, ஒரு குறிப்பிட்ட containerized அப்ளிகேஷன் ஒரு குறிப்பிட்ட காலகட்டத்தில் எவ்வளவு நேரம் இயங்கலாம் என்பதை Linux node-க்கு சொல்கிறோம். ஒரு node-ல் உள்ள மற்ற workloads-ஐ ஒரு wayward processes தொகுப்பு அநியாயமான அளவு CPU cycles எடுப்பதிலிருந்து பாதுகாக்க இதை செய்கிறோம். Motherboard-ல் உள்ள பல physical "cores"-ஐ வரையறுக்கவில்லை; ஆனால், ஒரு single container-ல் உள்ள processes அல்லது threads குழுமம் மற்ற அப்ளிகேஷன்களை overwhelm செய்வதை தவிர்க்க தற்காலிகமாக pause செய்வதற்கு முன் எவ்வளவு நேரம் இயங்கலாம் என்பதை configure செய்கிறோம்.

`container_cpu_cfs_throttled_seconds_total` என்ற ஒரு பயனுள்ள cAdvisor metric உள்ளது, இது throttled 5 ms slices அனைத்தையும் கூட்டி quota-ஐ விட process எவ்வளவு தூரம் மேலே உள்ளது என்ற கருத்தை தருகிறது. இந்த metric seconds-ல் உள்ளது, எனவே 100 ms பெற மதிப்பை 10-ஆல் வகுக்கிறோம், இது container-உடன் தொடர்புடைய உண்மையான காலம்.

100 ms நேரத்தில் முதல் மூன்று pods CPU usage-ஐ புரிந்துகொள்ள PromQL query:
```
topk(3, max by (pod, container)(rate(container_cpu_usage_seconds_total{image!="", instance="$instance"}[$__rate_interval]))) / 10
```
 400 ms vCPU usage கவனிக்கப்பட்டது.

![Throttled-Period](../../../../images/throttled-period.png)

PromQL நமக்கு per second throttling-ஐ தருகிறது, ஒரு second-ல் 10 periods உள்ளன. Per period throttling-ஐ பெற, 10-ஆல் வகுக்கிறோம். Limits setting-ஐ எவ்வளவு அதிகரிக்க வேண்டும் என்று தெரிய விரும்பினால், 10-ஆல் multiply செய்யலாம் (எ.கா., 400 ms * 10 = 4000 m).

மேலே உள்ள tools resource optimization-க்கான வாய்ப்புகளை கண்டறிய வழிகளை வழங்கும் அதே நேரத்தில், applications team ஒரு குறிப்பிட்ட அப்ளிகேஷன் CPU / Memory intensive ஆக உள்ளதா என்பதை கண்டறிந்து throttling / over-provisioning-ஐ தடுக்க resources-ஐ ஒதுக்க நேரம் செலவிட வேண்டும்.

