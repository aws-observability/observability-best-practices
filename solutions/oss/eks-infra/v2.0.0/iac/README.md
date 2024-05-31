# AWS Observability Accelerator for CDK

Welcome to the `AWS Observability Accelerator for CDK`!

![GitHub](https://img.shields.io/github/license/aws-quickstart/cdk-eks-blueprints)
![Build](https://codebuild.us-west-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiTWxBQzVUcTBvdSsvbE9mR0ZWeTJjbi96OUpBREorSG51UjMzQ1UyNXdmUzZ2dUJoTkhIODFJWjN2QjRGcnhWS0pYLzFQRU5uOThiUEp1WjEzS0htbUpVPSIsIml2UGFyYW1ldGVyU3BlYyI6IlRkUFRoTWtjdElBMkR5NEMiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)

The AWS Observability Accelerator for CDK is a set of opinionated modules
to help you set up observability for your AWS environments with AWS Native services and AWS-managed observability services such as Amazon Managed Service for Prometheus,Amazon Managed Grafana, AWS Distro for OpenTelemetry (ADOT) and Amazon CloudWatch.

AWS Observability Accelerator for CDK provides patterns with:

- [x] Curated metrics with CloudWatch Container Insights
- [x] Curated metrics with ADOT and Amazon Service for Prometheus Exporter
- [x] Logs using FluentBit and ADOT Exporter
- [x] Traces collection with XRAY Daemon
- [x] Traces collection with ADOT XRAY Exporter
- [x] Amazon Cloudwatch dashboards
- [x] Amazon Managed Grafana Dashboards
- [x] Amazon Managed Service for Prometheus - Alerting rules
- [x] Amazon Managed Service for Prometheus - Recording rules
- [x] GPU Infrastructure and Workload monitoring
- [x] Java/JMX Workload monitoring
- [x] NGINX monitoring
- [x] Istio Service Mesh monitoring
- [x] ADOT Collector monitoring
- [x] Cost monitoring (Coming Soon!)

## Single EKS Cluster AWS Native Observability Accelerator

![AWSNative-Architecture](https://github.com/aws-observability/cdk-aws-observability-accelerator/blob/main/docs/images/cloud-native-arch.png?raw=true)

## Single EKS Cluster Open Source Observability Accelerator

![OpenSource-Architecture](https://github.com/aws-observability/cdk-aws-observability-accelerator/blob/main/docs/images/oss-architecture.png?raw=true)

## Patterns

The individual patterns can be found in the [`lib`](https://github.com/aws-observability/cdk-aws-observability-accelerator/tree/main/lib) directory.  Most of the patterns are self-explanatory, for some more complex examples please use this guide and docs/patterns directory for more information.

## Usage

Before proceeding, make sure [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is installed on your machine.

To use this solution, you must have [Node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed. You will also use `make` and `brew` to simplify build and other common actions.

## Workstation Setup Options

### DevContainer Setup

Users can choose this option, if you dont want to run this solution on a mac or ubuntu machine. Please use the dev container configuration in the `.devcontainer` folder with [devpod](devpod.sh) or any other dev container environment to create a development environment with dependencies such as Node, NPM, aws-cli, aws-cdk, kubectl, helm dependencies for your local development with `cdk-aws-observability-accelerator` solution. 

### Ubuntu Setup

Follow the below steps to setup and leverage cdk-aws-observability-accelerator in your Ubuntu Linux machine.

1. **Update the package list**

Update the package list to ensure you're installing the latest versions.

```bash
sudo apt update
```

2. **Install make**

```bash
sudo apt install make
```

3. **Install Node.js and npm**

Install Node.js and npm using the NodeSource binary distributions.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

Note: The Node.js package from NodeSource includes npm

4. **Verify Node.js and npm Installation**

Check the installed version of Node.js:

```bash
node -v
```

The output should be `v20.x.x`.

Check the installed version of npm:

```bash
npm -v
```

The output should be a version greater than `10.1.x`.

If your npm version is not `10.1.x` or above, update npm with the following command:

```bash
sudo npm install -g npm@latest
```

Verify the installed version by running `npm -v`.

5. Install brew on ubuntu by following instructions as detailed in [docs.brew.sh](https://docs.brew.sh/Homebrew-on-Linux)

```bash
 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Add Homebrew to your PATH

```sh
test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
test -d /home/linuxbrew/.linuxbrew && eval "$(/home/linuxbrew/.linux  brew/bin/brew shellenv)"
test -r ~/.bash_profile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.bash_profile
echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.profile

```

Post completing the above, continue from Step: [Repo setup](#repo-setup)

### Mac Setup:

Follow the below steps to setup and leverage `cdk-aws-observability-accelerator` in your local Mac laptop.

1. Install `make` and `node` using brew

```sh
brew install make
brew install node
```

2. Install `npm`

```sh
sudo npm install -g n
sudo n stable
```

3. Make sure the following pre-requisites are met:

- Node version is a current stable node version 20.x.x

```bash
$ node -v
v20.8.0
```

Update (provided Node version manager is installed): `n stable`. May require `sudo`.

- NPM version must be 10.1 or above:

```bash
$ npm -v
10.1.0
```

Updating npm: `sudo n stable` where stable can also be a specific version above 10.1. May require `sudo`.

## Repo setup

1. Clone the `cdk-aws-observability-accelerator` repository

```sh
git clone https://github.com/aws-observability/cdk-aws-observability-accelerator.git
```

PS: If you are contributing to this repo, please make sure to fork the repo, add your changes and create a PR against it.

2. Once you have cloned the repo, you can open it using your favourite IDE and run the below commands to install the dependencies and build the existing patterns.

- Install project dependencies.

```text
make deps
```

- To view patterns that are available to be deployed, execute the following:

```sh
make build
```

- To list the existing CDK AWS Observability Accelerator Patterns

```text
make list
```

Note: Some patterns have a hard dependency on AWS Secrets (for example GitHub access tokens). Initially you will see errors complaining about lack of the required secrets. It is normal. At the bottom, it will show the list of patterns which can be deployed, in case the pattern you are looking for is not available, it is due to the hard dependency which can be fixed by following the docs specific to those patterns.

```ps1
To work with patterns use:
	$ make pattern <pattern-name> <list | deploy | synth | destroy>
Example:
	$ make pattern single-new-eks-opensource-observability deploy

Patterns:

	existing-eks-awsnative-observability
	existing-eks-mixed-observability
	existing-eks-opensource-observability
	multi-acc-new-eks-mixed-observability
	single-new-eks-awsnative-fargate-observability
	single-new-eks-awsnative-observability
	single-new-eks-cluster
	single-new-eks-fargate-opensource-observability
	single-new-eks-gpu-opensource-observability
	single-new-eks-graviton-opensource-observability
	single-new-eks-inferentia-opensource-observability
	single-new-eks-mixed-observability
	single-new-eks-opensource-observability
```

- Bootstrap your CDK environment.

```sh
npx cdk bootstrap
```

- You can then deploy a specific pattern with the following:

```sh
make pattern single-new-eks-opensource-observability deploy
```

- To access instructions for individual patterns check documentation in `docs/patterns` directory.

# Developer Flow

## Modifications

All files are compiled to the dist folder including `lib` and `bin` directories. For iterative development (e.g. if you make a change to any of the patterns) make sure to run compile:

```bash
make compile
```

The `compile` command is optimized to build only modified files and is fast.

## New Patterns

To create a new pattern, please follow these steps:

1. Under lib create a folder for your pattern, such as `<pattern-name>-pattern`. If you plan to create a set of patterns that represent a particular subdomain, e.g. `security` or `hardening`, please create an issue to discuss it first. If approved, you will be able to create a folder with your subdomain name and group your pattern constructs under it.
2. Blueprints generally don't require a specific class, however we use a convention of wrapping each pattern in a plain class like `<Pattern-Name>Pattern`. This class is generally placed in `index.ts` under your pattern folder.
3. Once the pattern implementation is ready, you need to include it in the list of the patterns by creating a file `bin/<pattern-name>.ts`. The implementation of this file is very light, and it is done to allow patterns to run independently.

Example simple synchronous pattern:

```typescript
import SingleNewEksOpenSourceobservabilityPattern from '../lib/single-new-eks-opensource-observability-pattern';
import { configureApp } from '../lib/common/construct-utils';

const app = configureApp();

new SingleNewEksOpenSourceobservabilityPattern(app, 'single-new-eks-opensource');
 // configureApp() will create app and configure loggers and perform other prep steps
```

## Security

See [CONTRIBUTING](./CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
