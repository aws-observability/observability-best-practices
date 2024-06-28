#!/usr/bin/env bash
# This script will do the following:
# 1. Create networking
# 2. Create AMP
# 3. Create EC2 & SG
# 4. Create IAM
# 5. Create Workspaces
# This script should be run using the command ". ./prometheusmonitor.sh" to preserve the environment variables.

printf "Starting Automation --- Setting up network.\n"

PROMETHEUS_CIDR=192.168.100.0/24
PROMETHEUS_VPCID=$(aws ec2 create-vpc \
  --cidr-block $PROMETHEUS_CIDR \
  --tag-specification ResourceType=vpc,Tags=['{Key=Name,Value=PROMETHEUS_VPC}'] \
  --query Vpc.VpcId \
  --output text)
  
PROMETHEUS_PUBSUBNET_CIDR=192.168.100.0/25
PROMETHEUS_PUBSUBNET_ID=$(aws ec2 create-subnet \
  --vpc-id $PROMETHEUS_VPCID \
  --cidr-block $PROMETHEUS_CIDR \
  --tag-specification ResourceType=subnet,Tags=['{Key=Name,Value=PROMETHEUS_PUBSUBNET}'] \
   --query Subnet.SubnetId --output text)

PROMETHEUS_IGW_ID=$(aws ec2 create-internet-gateway  \
  --tag-specifications ResourceType=internet-gateway,Tags=['{Key=Name,Value=PROMETHEUS_IGW}'] \
  --query InternetGateway.InternetGatewayId \
   --output text)
   
aws ec2 attach-internet-gateway \
  --vpc-id $PROMETHEUS_VPCID \
  --internet-gateway-id $PROMETHEUS_IGW_ID
  
PROMETHEUS_RT_ID=$(aws ec2 create-route-table \
  --vpc-id $PROMETHEUS_VPCID \
  --tag-specifications ResourceType=route-table,Tags=['{Key=Name,Value=PROMETHEUS_ROUTE}']  \
  --query RouteTable.RouteTableId \
  --output text)
  
aws ec2 associate-route-table  \
  --route-table-id $PROMETHEUS_RT_ID \
  --subnet-id $PROMETHEUS_PUBSUBNET_ID 
  
aws ec2 create-route \
  --route-table-id $PROMETHEUS_RT_ID  \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $PROMETHEUS_IGW_ID
  
 aws ec2 modify-subnet-attribute --subnet-id $PROMETHEUS_PUBSUBNET_ID \
  --map-public-ip-on-launch
  
PROMETHEUS_WKSPACE_PEER=$(aws ec2 create-vpc-peering-connection --vpc-id \
  "$PROMETHEUS_VPCID" --peer-vpc-id "$WORKSPACES_VPCID" --query \
  VpcPeeringConnection.VpcPeeringConnectionId --output text)
  
aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id \
  "$PROMETHEUS_WKSPACE_PEER"
  
aws ec2 create-tags --resources "$PROMETHEUS_WKSPACE_PEER" --tags \
  'Key=Name,Value=PROMETHEUS_WKSPACE_PEERING'

aws ec2 create-route --route-table-id $(aws ec2 describe-route-tables \
  --filter Name=vpc-id,Values=$WORKSPACES_VPCID Name=association.main,Values=false\
  --query RouteTables[].RouteTableId --output text) --destination-cidr-block \
   $PROMETHEUS_CIDR --vpc-peering-connection-id "$PROMETHEUS_WKSPACE_PEER"
 
aws ec2 create-route --route-table-id $(aws ec2 describe-route-tables --filter \
  Name=vpc-id,Values=$PROMETHEUS_VPCID Name=tag:Name,Values=PROMETHEUS_ROUTE \
  --query RouteTables[].RouteTableId --output text) --destination-cidr-block \
  $(aws ec2 describe-vpcs --vpc-ids $WORKSPACES_VPCID \
  --query Vpcs[].CidrBlock --output text) --vpc-peering-connection-id \
  "$PROMETHEUS_WKSPACE_PEER"

printf "Setting up AMP workspace.\n"

aws amp create-workspace \
  --alias $AMP_WORKSPACE_NAME \
  --region $AWS_REGION

AMP_WORKSPACE_ID=$(aws amp list-workspaces \
  --alias $AMP_WORKSPACE_NAME \
  --region=${AWS_REGION} \
  --query 'workspaces[0].[workspaceId]' \
  --output text)

# Be sure that the status code is ACTIVE with the below commands and it takes couple of minutes for status code to become ACTIVE.

aws amp describe-workspace \
  --workspace-id  $AMP_WORKSPACE_ID

printf "Setting up Prometheus EC2.\n"

PROMETHEUS_IMAGEID=$(aws ssm get-parameters --names \
  /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2 \
  --query 'Parameters[0].[Value]' --output text)

aws ec2 create-key-pair \
  --key-name MyKeyPair \
  --output text > MyKeyPair.pem

# Now, we will create the EC2 which will run the Prometheus Server to send Workspaces metrics to the AWS AMP Service. 

aws ec2 run-instances \
  --image-id $PROMETHEUS_IMAGEID \
  --no-cli-pager \
  --count 1 --instance-type t2.medium \
  --key-name MyKeyPair \
  --subnet-id $PROMETHEUS_PUBSUBNET_ID \
   --security-group-ids $(aws ec2 describe-security-groups \
        --filter Name=vpc-id,Values=$PROMETHEUS_VPCID \
        --query SecurityGroups[].GroupId \
        --output text) \
  --user-data file://workspacesprometheus.txt \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=PROMETHEUSFORWARDERSERVER}]'

printf "waiting for EC2 to finish configuration. \n"

sleep 600

printf "Setting up security groups.\n"

aws ec2 create-security-group  \
  --group-name PROMETHEUS_TO_WORKSPACES_SG \
  --vpc-id $WORKSPACES_VPCID \
  --description "Security Group for Workspace instances to allow ports 9182"   
 
aws ec2 authorize-security-group-ingress  \
  --group-id $(aws ec2 describe-security-groups  --filters \
  Name=vpc-id,Values=String,$WORKSPACES_VPCID \
  Name=group-name,Values=Name,PROMETHEUS_TO_WORKSPACES_SG \
  --query SecurityGroups[].GroupId  --output text) \
  --protocol tcp  \
  --port 9182  \
  --cidr $(aws ec2 describe-instances --filters Name=tag:Name,Values=PROMETHEUSFORWARDERSERVER \
  --query Reservations[].Instances[].PrivateIpAddress --output text)/32 

aws ec2 create-security-group  \
  --group-name PROMETHEUS_SERVER_SG  \
  --vpc-id $PROMETHEUS_VPCID \
  --description "Security Group for Prometheus EC2 instances to allow ports 9090 and 22" 
  
PROMETHEUS_SERVER_SG_GID=$(aws ec2 describe-security-groups  --filters \
  Name=vpc-id,Values=String,$PROMETHEUS_VPCID \
  Name=group-name,Values=Name,PROMETHEUS_SERVER_SG \
  --query SecurityGroups[].GroupId  --output text)

aws ec2 authorize-security-group-ingress  \
  --group-id $PROMETHEUS_SERVER_SG_GID \
  --protocol tcp  --port 9090  --cidr $(aws ec2 describe-vpcs \
  --vpc-ids $PROMETHEUS_VPCID --query Vpcs[].CidrBlock --output text) 

aws ec2 authorize-security-group-ingress  \
  --group-id $PROMETHEUS_SERVER_SG_GID \
  --protocol tcp  --port 9090  --cidr $(aws ec2 describe-vpcs \
  --vpc-ids $WORKSPACES_VPCID --query Vpcs[].CidrBlock --output text) 
 
aws ec2 authorize-security-group-ingress  \
  --group-id $PROMETHEUS_SERVER_SG_GID \
  --protocol tcp  --port 22  --cidr $(aws ec2 describe-vpcs --vpc-ids \
  $WORKSPACES_VPCID --query Vpcs[].CidrBlock --output text) 

aws ec2 authorize-security-group-ingress  \
   --group-id $PROMETHEUS_SERVER_SG_GID \
  --protocol tcp  --port 22  --cidr $(aws ec2 describe-vpcs --vpc-ids \
  $PROMETHEUS_VPCID --query Vpcs[].CidrBlock --output text)
  
 aws ec2 describe-security-groups \
   --filters Name=vpc-id,Values=String,$PROMETHEUS_VPCID \
    Name=group-name,Values=String,PROMETHEUS_SERVER_SG

WORKSPACES_SG_GID=$(aws ec2 describe-security-groups  --filters \
  Name=vpc-id,Values=String,$WORKSPACES_VPCID \
  Name=group-name,Values=Name,PROMETHEUS_TO_WORKSPACES_SG \
  --query SecurityGroups[].GroupId  --output text)

aws workspaces modify-workspace-creation-properties \
--resource-id $(aws workspaces describe-workspace-directories \
 --query Directories[].DirectoryId \
 --output text) \
--workspace-creation-properties  CustomSecurityGroupId="$WORKSPACES_SG_GID"

PROMETHEUS_INSTANCE_ID=$(aws ec2 describe-instances --query \
  "Reservations[*].Instances[*].InstanceId"  --filters \
  "Name=tag:Name,Values=*PROMETHEUSFORWARDERSERVER*" \
  "Name=instance-state-name,Values=running" --output text)

PROMETHEUS_SG_ID=$(aws ec2 describe-security-groups  \
   --filters Name=vpc-id,Values=String,$PROMETHEUS_VPCID Name=group-name,Values=Name,PROMETHEUS_SERVER_SG \
    --query SecurityGroups[].GroupId  --output text)

aws ec2 modify-instance-attribute \
  --instance-id $PROMETHEUS_INSTANCE_ID \
  --groups $PROMETHEUS_SG_ID

printf "Setting up IAM.\n"

cat > AmazonPrometheusRemoteWriteTrust.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

aws iam create-role \
  --role-name PromWrite  \
  --assume-role-policy-document file://AmazonPrometheusRemoteWriteTrust.json

aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \
  --role-name PromWrite

#This Role must be attached to an instance profile so Amazon EC2 can use the Role

aws iam create-instance-profile \
  --instance-profile-name PromWrite
  
aws iam add-role-to-instance-profile \
  --instance-profile-name PromWrite \
  --role-name PromWrite

printf "waiting five minutes for the instance profile creation and assign it to EC2. \n"
sleep 300

#Now the the role & instance profile is created successfully, it must be attached to the PrometheusServer on EC2.

aws ec2 associate-iam-instance-profile \
--iam-instance-profile Name=PromWrite \
--instance-id $PROMETHEUS_INSTANCE_ID

printf "creating workspace.\n"

cat > create-workspaces.json << EOF

{
  "Workspaces" : [
    {
      "DirectoryId" : "$WORKSPACES_DIRECTORY",
      "UserName" : "$WORKSPACES_USER",
      "BundleId" : "$WORKSPACES_BUNDLE"
    }
  ]
}
EOF

aws workspaces create-workspaces \
  --cli-input-json file://create-workspaces.json

printf "Automation Complete!!!\n"