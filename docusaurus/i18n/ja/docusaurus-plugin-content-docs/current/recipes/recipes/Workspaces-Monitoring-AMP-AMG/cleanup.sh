#!/usr/bin/env bash
# This script will perform the following:
# 1. Clean up the EC2
# 2. Clean up networking
# 3. Clean up the workspace
# 4. Clean up the IAM resources
# 5. Clean up the AMP workspace
# This script should be run using the command ". ./cleanup.sh" to preserve the environment variables.

printf "Starting Cleanup.\n"

aws ec2 stop-instances --instance-ids $(aws ec2 describe-instances \
  --filters Name=tag:Name,Values=PROMETHEUSFORWARDERSERVER \
  "Name=instance-state-name,Values=running" --query \
  Reservations[].Instances[].InstanceId --output text)

sleep 60

aws ec2 terminate-instances --instance-ids $(aws ec2 describe-instances \
  --filters Name=tag:Name,Values=PROMETHEUSFORWARDERSERVER --query \
   Reservations[].Instances[].InstanceId --output text)

sleep 60

export PROM_VPCID=$(aws ec2 describe-vpcs  --filter \
  Name=tag:Name,Values=PROMETHEUS_VPC --query 'Vpcs[*].VpcId' --output text)

aws ec2 detach-internet-gateway --vpc-id $PROM_VPCID \
  --internet-gateway-id  $(aws ec2 describe-internet-gateways --filter \
  Name=tag:Name,Values=PROMETHEUS_IGW --query \
  'InternetGateways[*].InternetGatewayId' --output text)

aws ec2 delete-internet-gateway --internet-gateway-id  \
  $(aws ec2 describe-internet-gateways --filter Name=tag:Name,Values=PROMETHEUS_IGW \
  --query 'InternetGateways[*].InternetGatewayId' --output text)

aws ec2 delete-vpc-peering-connection --vpc-peering-connection-id \
  $(aws ec2 describe-vpc-peering-connections --query \
  "VpcPeeringConnections[*].VpcPeeringConnectionId"  --filters \
  "Name=tag:Name,Values=PROMETHEUS_WKSPACE_PEERING" --output text)

aws ec2 delete-subnet --subnet-id $(aws ec2 describe-subnets --filter \
  Name=tag:Name,Values=PROMETHEUS_PUBSUBNET --query \
  'Subnets[*].SubnetId' --output text)

aws ec2 delete-route-table --route-table-id $(aws ec2 describe-route-tables --filter \
  Name=tag:Name,Values=PROMETHEUS_ROUTE --query \
  'RouteTables[*].RouteTableId' --output text)

aws ec2 delete-security-group --group-id \
$(aws ec2 describe-security-groups \
    --group-ids --filter \
  Name=group-name,Values=PROMETHEUS_SERVER_SG --query \
  'SecurityGroups[*].GroupId' --output text)

aws ec2 delete-security-group --group-id \
$(aws ec2 describe-security-groups \
    --group-ids --filter \
  Name=group-name,Values=PROMETHEUS_TO_WORKSPACES_SG --query \
  'SecurityGroups[*].GroupId' --output text)

aws ec2 delete-vpc --vpc-id $PROM_VPCID

aws workspaces terminate-workspaces --terminate-workspace-requests \
  $(aws workspaces describe-workspaces --user-name $WORKSPACES_USER \
  --directory-id $WORKSPACES_DIRECTORY --query 'Workspaces[*].WorkspaceId' \
  --output text)
  
aws iam detach-role-policy --role-name PromWrite \
  --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess

aws iam remove-role-from-instance-profile --instance-profile-name \
  PromWrite --role-name PromWrite

aws iam delete-instance-profile --instance-profile-name PromWrite

aws iam delete-role --role-name PromWrite

aws amp delete-workspace --workspace-id $AMP_WORKSPACE_ID

printf "Automation Complete!!!\n"

