#!/bin/bash
BUCKET_ID=$(dd if=/dev/random bs=8 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n')
BUCKET_NAME=aurora-monitoring-grafana-pi-$BUCKET_ID
AWS_PROFILE=dime-kkpfg-uat
AWS_REGION=ap-southeast-1
echo $BUCKET_NAME > bucket-name.txt
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION