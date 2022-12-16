# Monitoring Performance Insights and Enhanced Monitoring Metrics using AWS Lambda function

- `function` - A Python function.
- `template.yml` - An AWS CloudFormation template that creates an application.
- `1-create-bucket.sh`, `2-deploy.sh`, etc. - Shell scripts that use the AWS CLI to deploy and manage the application.

Use the following instructions to deploy the sample application.

# Requirements
- [Python 3.7](https://www.python.org/downloads/). Sample also works with Python 3.8 and 3.9. 
- The Bash shell. For Linux and macOS, this is included by default. In Windows 10, you can install the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to get a Windows-integrated version of Ubuntu and Bash.
- [The AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) v1.17 or newer.

If you use the AWS CLI v2, add the following to your [configuration file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) (`~/.aws/config`):

```
cli_binary_format=raw-in-base64-out
```

This setting enables the AWS CLI v2 to load JSON events from a file, matching the v1 behavior.

# Setup
Download or clone this repository.

    $ git clone https://github.com/aws-observability/aws-o11y-recipes.git
    $ cd sandbox/monitor-aurora-with-grafana

To create a new bucket for deployment artifacts, run `1-create-bucket.sh`.

    $ ./1-create-bucket.sh
    make_bucket: aurora-monitoring-grafana-pi-08d5755ce382dbda

# Deploy
To deploy the application, run `2-deploy.sh`.

    $ ./2-deploy.sh
    Uploading to 94fc9694f6a3ad4471c6b835d15206e7  1859 / 1859.0  (100.00%)
    Successfully packaged artifacts and wrote output template to file out.yml.
    Execute the following command to deploy the packaged template
    aws cloudformation deploy --template-file /Users/dev/solutions/aws-o11y-recipes/sandbox/monitor-aurora-with-grafana/out.yml        --stack-name <YOUR STACK NAME>

This script uses AWS CloudFormation to deploy the Lambda functions and an IAM role. If the AWS CloudFormation stack that contains the resources already exists, the script updates it with any changes to the template or function code.

# Cleanup
To delete the application, run `3-cleanup.sh`.

    $ ./3-cleanup.sh
