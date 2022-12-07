##!/bin/bash
CLUSTER_NAME=YOUR-EKS-CLUSTER-NAME
REGION=YOUR-EKS-CLUSTER-REGION
SERVICE_ACCOUNT_NAMESPACE=aws-otel-eks
SERVICE_ACCOUNT_NAME=adot-collector
SERVICE_ACCOUNT_IAM_ROLE=EKS-ADOT-ServiceAccount-Role
SERVICE_ACCOUNT_IAM_POLICY_1=arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
SERVICE_ACCOUNT_IAM_POLICY_2=arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess
SERVICE_ACCOUNT_IAM_POLICY_3=arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess

eksctl utils associate-iam-oidc-provider \
--cluster=$CLUSTER_NAME \
--approve

eksctl create iamserviceaccount \
--cluster=$CLUSTER_NAME \
--region=$REGION \
--name=$SERVICE_ACCOUNT_NAME \
--namespace=$SERVICE_ACCOUNT_NAMESPACE \
--role-name=$SERVICE_ACCOUNT_IAM_ROLE \
--attach-policy-arn=$SERVICE_ACCOUNT_IAM_POLICY_1 \
--attach-policy-arn=$SERVICE_ACCOUNT_IAM_POLICY_2 \
--attach-policy-arn=$SERVICE_ACCOUNT_IAM_POLICY_3 \
--override-existing-serviceaccounts \
--approve