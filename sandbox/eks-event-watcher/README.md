
# Managing Amazon EKS control plane events

[![Pulls](https://img.shields.io/badge/ECR%20Public%20pulls-3.2M-orange)](https://gallery.ecr.aws/m8u2y2m7/eks-event-watcher)
[![License](https://img.shields.io/badge/license-MIT--0-blue)](LICENSE)

> **Over 3.2 million pulls.** The container image for this project has been pulled more than
> 3,200,000 times from the [Amazon ECR Public Gallery](https://gallery.ecr.aws/m8u2y2m7/eks-event-watcher)
> — averaging roughly 66,000 pulls a month since 2022.

## Context

Currently EKS event TTL is set to 60m. Some customers have shown interest to increase the TTL
(https://github.com/aws/containers-roadmap/issues/785). It will be an additional burden if EKS control plane
provided the option to increase TTL as this will add load to ETCD and storage. This solution here tries to
bridge the gap to capture events beyond 60 minutes to cloudwatch, if the customers still achieve the same. That
way control plane event TTL is not modified but at the sametime, if customer wanted to capture the events
beyond 60m, they could achieve the same.

## Prerequisites

For this walkthrough, you should have the following prerequisites:

* An AWS account
* Running AWS EKS cluster
* Basic Kubernetes knowledge (Pods, namespace and deployments)

## Solution flow

<img width="639" alt="image" src="https://user-images.githubusercontent.com/1725781/184262584-24302dee-2bf6-409e-9de5-c48a5578661c.jpg">

## Quick start (no build required)

A prebuilt multi-architecture image (`linux/amd64` and `linux/arm64`) is published to the ECR Public Gallery,
and the Helm chart in this repository already points at it. Nothing needs to be built or pushed:

```sh
git clone https://github.com/aws-samples/eks-event-watcher.git
helm install cpe eks-event-watcher/helm/cpe-chart
```

That creates the Deployment along with the ClusterRole and ClusterRoleBinding the watcher needs to read
cluster events.

To pull the image directly:

```sh
docker pull public.ecr.aws/m8u2y2m7/eks-event-watcher:latest
```

Image: [`public.ecr.aws/m8u2y2m7/eks-event-watcher`](https://gallery.ecr.aws/m8u2y2m7/eks-event-watcher)

### Configuration

The watcher takes two optional arguments:

| Flag | Default | Purpose |
| --- | --- | --- |
| `-interval` | `3600` | Event fetch frequency, in seconds |
| `-list` | `event,pod,node,namespace,service,pvc` | Comma-separated resources to watch |

To change them, uncomment the `args` line in `helm/cpe-chart/templates/deployment.yaml`:

```yaml
args: ["-interval", "30", "-list", "event,pod,node"]
```

### Viewing the events

The watcher writes each event to stdout. With CloudWatch Container Insights or Fluent Bit configured on the
cluster, those records land in CloudWatch Logs, where they persist past the 60-minute control plane TTL and can
be queried with Logs Insights.

## Steps to create custom image (optional)

Below steps are required, if you want to customize various events provided in the event_watecher.py,
conatainerize it, push to AWS ECR and use that in your deployment.

### (1) Set environment variables
```sh
export AWS_REGION=<region>
export ACCOUNTID=<accountId>
export ECR_REPO=<repo_name>
```

### (2) Create an AWS Elastic Container Registry (ECR) repository:
Lets create a repository inside Elastic Container Registry (ECR) as the placeholder to store the container images.

```sh
 aws ecr create-repository --repository-name=$ECR_REPO
```
Once the ECR repository is created, log in, so that we are ready to push the container images.

```sh
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNTID.dkr.ecr.$AWS_REGION.amazonaws.com
```

### (3) Create the control-planes-events application using the source code provided, containerize it with Docker

Lets create a directory to store the source code, call it as "control-plane-events-app" and get inside the folder.

```sh
 mkdir control-plane-events-app && cd $_
```

Change the app/event_watcher.py script to your needs and use the docker build command to containerize it

```sh
 docker image build -t $ACCOUNTID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO .
```

### (4) Push the created container image to your ECR repository:

Below command pushes the created container image to ECR repository (created in step #2)

```sh
 docker push $ACCOUNTID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO
```
### (5) Update the container image to Deployment yaml :

Update the container image in the deployment yaml like below

```sh
 image: $ACCOUNTID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO
```

Or override it at install time without editing the chart:

```sh
helm install cpe helm/cpe-chart \
  --set image.repository=$ACCOUNTID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO
```

## Files

| Directory | Contents | Target |
| --- | :---: | :---: |
| app | Files for containerization | ECR |
| helm/cpe-chart | Helm chart for deploying to EKS | EKS |
| k8s_utils | Sample workloads and collector config | EKS |

### Files inside app

| File | Contents |
| --- | :---: |
| Dockerfile | File for containerization |
| requirements.txt | Python dependency |
| event_watcher.py | Control plane events blueprint script |

### Files inside helm/cpe-chart

| File | Contents |
| --- | :---: |
| values.yaml | Chart values, including the published image reference |
| templates/deployment.yaml | File for deploying above app to k8s |
| templates/cluster_role.yaml | To create cluster role |
| templates/cluster_role_binding.yaml | To create cluster role binding |

### Files inside k8s_utils

| File | Contents |
| --- | :---: |
| intolerable-pod.yaml | Sample pod for generating scheduling events |
| mega-pod.yaml | Sample pod for generating resource events |
| otel-collector-config.yaml | OpenTelemetry collector configuration |

## Author

**Siva Guruvareddiar** — [LinkedIn](https://www.linkedin.com/in/sguruvar/)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
