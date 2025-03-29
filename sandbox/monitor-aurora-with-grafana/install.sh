#!/bin/bash

# Create S3 bucket for Cloudformation Template
./1-create-bucket.sh
# Any Layer for Lambda function as specefied in requirements.txt
#./2-build-layer.sh
# Deploy the cloudformation stack
./2-deploy.sh
# Trigger the lambda function using event.json file
# ./4-invoke.sh

