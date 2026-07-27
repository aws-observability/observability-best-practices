##!/bin/bash
CLUSTER_NAME=YOUR_EKS_CLUSTER_NAME
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
OIDC_PROVIDER=$(aws eks describe-cluster --name $CLUSTER_NAME --query "cluster.identity.oidc.issuer" --output text | sed -e "s/^https:\/\///")

SERVICE_ACCOUNT_IAM_ROLE=EKS-GrafanaAgent-AMP-ServiceAccount-Role
SERVICE_ACCOUNT_IAM_ROLE_DESCRIPTION="IAM role to be used by a K8s service account with write access to AMP"
SERVICE_ACCOUNT_IAM_POLICY=AWSManagedPrometheusWriteAccessPolicy
SERVICE_ACCOUNT_IAM_POLICY_ARN=arn:aws:iam::$AWS_ACCOUNT_ID:policy/$SERVICE_ACCOUNT_IAM_POLICY
#
# Setup a trust policy designed for a specific combination of K8s service account and namespace to sign in from a Kubernetes cluster which hosts the OIDC Idp.
# If the IAM role already exists, then add this new trust policy to the existing trust policy
#
echo "Creating a new trust policy"
read -r -d '' NEW_TRUST_RELATIONSHIP <<EOF
 [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_PROVIDER}:sub": "system:serviceaccount:grafana-agent:grafana-agent"
        }
      }
    }
  ]
EOF
#
# Get the old trust policy, if one exists, and append it to the new trust policy
#
OLD_TRUST_RELATIONSHIP=$(aws iam get-role --role-name $SERVICE_ACCOUNT_IAM_ROLE --query 'Role.AssumeRolePolicyDocument.Statement[]' --output json)
COMBINED_TRUST_RELATIONSHIP=$(echo $OLD_TRUST_RELATIONSHIP $NEW_TRUST_RELATIONSHIP | jq -s add)
echo "Appending to the existing trust policy"
read -r -d '' TRUST_POLICY <<EOF
{
  "Version": "2012-10-17",
  "Statement": ${COMBINED_TRUST_RELATIONSHIP}
}
EOF
echo "${TRUST_POLICY}" > TrustPolicy.json
#
# Setup the permission policy grants write permissions for all AWS StealFire workspaces
#
read -r -d '' PERMISSION_POLICY <<EOF
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Effect":"Allow",
         "Action":[
            "aps:RemoteWrite"
         ],
         "Resource":"*"
      }
   ]
}
EOF
echo "${PERMISSION_POLICY}" > PermissionPolicy.json

#
# Create an IAM permission policy to be associated with the role, if the policy does not already exist
#
SERVICE_ACCOUNT_IAM_POLICY_ID=$(aws iam get-policy --policy-arn $SERVICE_ACCOUNT_IAM_POLICY_ARN --query 'Policy.PolicyId' --output text)
if [ "$SERVICE_ACCOUNT_IAM_POLICY_ID" = "" ]; 
then
  echo "Creating a new permission policy $SERVICE_ACCOUNT_IAM_POLICY"
  aws iam create-policy --policy-name $SERVICE_ACCOUNT_IAM_POLICY --policy-document file://PermissionPolicy.json 
else
  echo "Permission policy $SERVICE_ACCOUNT_IAM_POLICY already exists"
fi

#
# If the IAM role already exists, then just update the trust policy.
# Otherwise create one using the trust policy and permission policy
#
SERVICE_ACCOUNT_IAM_ROLE_ARN=$(aws iam get-role --role-name $SERVICE_ACCOUNT_IAM_ROLE --query 'Role.Arn' --output text)
if [ "$SERVICE_ACCOUNT_IAM_ROLE_ARN" = "" ]; 
then
  echo "$SERVICE_ACCOUNT_IAM_ROLE role does not exist. Creating a new role with a trust and permission policy"
  #
  # Create an IAM role for Kubernetes service account 
  #
  SERVICE_ACCOUNT_IAM_ROLE_ARN=$(aws iam create-role \
  --role-name $SERVICE_ACCOUNT_IAM_ROLE \
  --assume-role-policy-document file://TrustPolicy.json \
  --description "$SERVICE_ACCOUNT_IAM_ROLE_DESCRIPTION" \
  --query "Role.Arn" --output text)
  #
  # Attach the trust and permission policies to the role
  #
  aws iam attach-role-policy --role-name $SERVICE_ACCOUNT_IAM_ROLE --policy-arn $SERVICE_ACCOUNT_IAM_POLICY_ARN  
else
  echo "$SERVICE_ACCOUNT_IAM_ROLE_ARN role already exists. Updating the trust policy"
  #
  # Update the IAM role for Kubernetes service account with a with the new trust policy
  #
  aws iam update-assume-role-policy --role-name $SERVICE_ACCOUNT_IAM_ROLE --policy-document file://TrustPolicy.json
fi
echo $SERVICE_ACCOUNT_IAM_ROLE_ARN

# EKS cluster hosts an OIDC provider with a public discovery endpoint.
# Associate this Idp with AWS IAM so that the latter can validate and accept the OIDC tokens issued by Kubernetes to service accounts.
# Doing this with eksctl is the easier and best approach.
#
eksctl utils associate-iam-oidc-provider --cluster $CLUSTER_NAME --approve
