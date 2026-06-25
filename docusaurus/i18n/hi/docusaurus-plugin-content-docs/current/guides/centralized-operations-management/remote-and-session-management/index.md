---
sidebar_position: 6
---
# रिमोट और सत्र प्रबंधन

रिमोट और सत्र प्रबंधन में Run Command, Fleet Manager और Session Manager जैसी सुविधाएँ शामिल हैं।

## रिमोट प्रबंधन

Using Run Command, a tool in AWS Systems Manager, you can remotely and securely manage the configuration of your managed nodes. Run Command allows you to automate common administrative tasks and perform one-time configuration changes at scale. You can use Run Command from the AWS Management Console, the AWS Command Line Interface (AWS CLI), AWS Tools for Windows PowerShell, or the AWS SDKs.

![Remote Management](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-1.png "Remote Management")

Common uses cases for using run command include:

* **Bootstrap nodes:** You can install or bootstrap applications to all or specific nodes.
* **Configuration management:** Systems Manager supports various Domain Specific Languagues (DSLs), including [Ansible](https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/), [Salt States](https://aws.amazon.com/blogs/mt/running-salt-states-using-amazon-ec2-systems-manager/), and [PowerShell DSC](https://aws.amazon.com/blogs/mt/combating-configuration-drift-using-amazon-ec2-systems-manager-and-windows-powershell-dsc/).
* **Join to domain:** Join nodes to a Windows domain
* **Deploy other Amazon agents:** Store agent config in Parameter Store

### Composite Command Documents

These Systems Manager documents define the actions that you want to perform on managed nodes. Systems Manager offers a variety of pre-defined public documents and provides the ability to customize the documents as well. You can [execute composite documents](https://aws.amazon.com/about-aws/whats-new/2017/10/amazon-ec2-systems-manager-now-integrates-with-github/) as part of your configurations. Composite documents perform the task of executing one or more secondary documents.

Things to keep in mind while leveraging composite command documents are that there’s only sequential operations and no branching. You can enable this through AWS-RunDocument to execute documents that are stored in Systems Manager, private or public GitHub, or Amazon S3. This is achieved by using [aws:downloadContent](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-downloadContent) and [aws:runDocument](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-rundocument) plugins. The aws:runDocument plugin executes documents that reside in Systems Manager or in the local path. An example of this is AWS-RunPatchBaselineWithHooks.

### Restricting Run Command

You can restrict the commands that a user can run in a session through IAM users/ Roles. In the document, you define the command that is run when the user starts a session and the parameters that the user can provide to the command. You can restrict access based on: ssm:SendCommand, Document name or prefix, Resource tags, and Resource IDs. You can also enforce ABAC policies using SAML session tags.  

![Restricting Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-2.png "Restricting Run Command")

1. For example, you can grant access to specific managed nodes based on the department that your [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) user belongs to.
1. Alice and Bob federate into [AWS Management Console](http://aws.amazon.com/console) using their external Identity Provider (IdP). Both federated users MUST access specific EC2 instances using Session Manager based on their "department" membership, Amber and Blue respectively.

### Multi-account and multi-Region Run Command

* Run Command itself is per account/Region
* Utilize Automation to invoke across accounts/Region

Automation, a tool in AWS Systems Manager, simplifies common maintenance, deployment, and remediation tasks. You can leverage for targeting multiple accounts / Regions.  For multi-account/ multi- Region automation, when targeting child accounts the command document needs to exist in the target account/ Region. You can use CloudFormation or Terraform to deploy the command documents. Necessary permissions need to be in place for Systems Manager service to be able to execute the automation actions. Reference the Automation section for more information.

![Multi-account and multi-Region Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-3.png "Multi-account and multi-Region Run Command")

### Scheduling Run Command through AWS Systems Manager State Manager Associations

State Manager helps you automate the process of keeping your managed nodes from on AWS, on-premises, or multicloud in a desired state. In State Manager, an association is a binding between your expressed configuration in a document, and a set of targets, on a specific schedule, to ensure consistent state. You can start an automation by creating a State Manager association with a runbook.  The Command document associated with the configurations needs to exist in every target account/ Region.

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-4.png "Scheduling Run Command")

### Handling Error, Exit, and Reboot codes

By default, the exit code of the last command run in a script is reported as the exit code for the entire script.

* `Exit 0` results in the status: `Success`
* `Exit 1` or otherwise*, results in the status: `Failed`
* You can include specific exit codes to more quickly identify errors.
* Reboot codes:
  * Windows: `exit 3010`
  * Linux: `exit 194`

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-5.png "Scheduling Run Command")

### Monitoring Run Command using Amazon CloudWatch

AWS Systems Manager publishes metrics about the status of Run Command commands to CloudWatch, allowing you to set alarms based on those metrics. There are specific metrics Systems Manager pushes to CloudWatch around commands that have ```Delivery Time Out```, how many ```Failed```, and how many were ```Successful```.

To learn more on monitoring run command, visit [Monitoring Run Command metrics using Amazon CloudWatch.](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-cloudwatch-metrics.html)

## Session Management

AWS Session Manager is a fully managed AWS Systems Manager tool. You can use either an interactive one-click browser-based shell or the AWS Command Line Interface (AWS CLI) to interact with the managed node. Session Manager provides secure node management without the need to open inbound ports, maintain bastion hosts, or manage SSH keys. You’re able to comply with corporate policies that require controlled access to managed nodes, strict security practices, and logs with node access details, while providing end users with simple one-click cross-platform access to your managed nodes.

### Governance

![Governance](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-6.png "Governance")

* ***Separate users from data***: A key tenant of Cloud Ops is separating users from data wherever possible. Session Manager closes off the inbound network ports that would allow anyone with the credentials to access and potentially change configuration on a server. Session Manager can go further by limiting users to running individual commands and viewing the results without ever having an interactive session.

* ***Manage access centrally***: Cloud Operations can result in an elastic, constant stream of changes to an environment. Rather than maintaining who can access each server on each server, Session Manager integrates with Identity Access Management to allow the central definition of who can access which nodes.

* ***Control access to workloads and components***: Organizations can use IAM to control access to nodes according to workload or role. For example, a Database Administrator might be able to remotely access any instance tagged as "Component: Database", or an application developer could remotely access any instance tagged with "Environment: Development". This attribute based access control allows project teams to work as fast as they need to on delivering value to the business, yet the organization is secure in the knowledge they are operating within defined guard rails.

* ***Restricting commands to specific roles:*** As we mentioned in Separate users from data, it is possible to allow a role to execute just the specific set of commands required for that role. For example, perhaps an Application Developer could "tail" a log file for their application in Production without having or needing interactive access to the Production environment.

* ***Grant temporary access for business reasons***: With extra features provided by open source and commercial temporary elevated access solutions it is even possible to deny remote access to all operators until and unless they have a valid business reason to access the server. For example, a production application server would have no way of being remotely accessed. However, during an incident an operator could request and be granted temporary access to the server to investigate the incident. This access would be associated with a recorded reason, approved by a second operator and be timed for only as long as needed to do the work.

### ऑब्ज़र्वेबिलिटी & Compliance

* **Logging VM and Container Session Activities & Monitoring managed node access and activity:** When a Terminal Session is started from the AWS Console using Session Manager, all the commands and their results of the session are able to be recorded to S3 and CloudWatch Log Groups. This can provide an audit trail of all changes made during an interactive session. You can also use CloudTrail events to monitor (and if necessary alert on) successful and unsuccessful remote sessions to nodes. For instance a remote session conducted outside of a defined change window could be alerted to the person in question and their manager.

### Simplify Operations

* **Single click access from the console:** Session Manager is well integrated with the AWS console offering "Connect" options from the EC2 console, the Session Manager console and the Fleet Manager console.
* **No need to manage SSH**: With Session Manager there is no need to manage the creation, distribution and refreshing of a PKI infrastructure for SSH access to your herd of elastic nodes. The central authorization via IAM replaces the need for storing, protecting and monitoring private keys across your fleet.
* **Allow access without opening security groups:** Using Session Manager’s "Port Forwarding" feature you can allow authorized access to your nodes without needing to open up or widen network access to the remote session ports of the instance. For example, a developer could have secure access to the Test environment’s database instance using a port forwarded from his home development machine via the Session Manager service to the instance in question over a fully encrypted and authenticated pipeline.
* **Centralized access:** The integration with the console and IAM allows your operators to have the remote access they require (and are authorized to have) from wherever they need to have that access.
* **Lower "blast radius":** Locking the inbound network ports and restricting remote access centrally to only those nodes that a users role requires we are lowering the "blast radius" that any potential breach might create.

### Optimize IT Costs

* **No need for Bastion or Jump Hosts:** Session Manager can remove the need to use Bastion or Jump Hosts from your environment – removing a 24x7 instance cost. This means replacing hosts with SSH and RDP inbound network ports open inbound, along with outbound access via SSH and RDP to other nodes in your environment. Instead access is secured via the same mechanism as the rest of your cloud environment – IAM – offering fine grained authorization and access to temporary credentials onto target nodes.
* **No additional charges for accessing EC2 instances**: Beyond the existing instance charges for EC2 there is no further charge required to use Session Manager to allow remote access to your EC2 nodes and containers.

### How does Session Manager work?

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-7.png "Session Manager")

1. The SSM agent must be installed on the node along with connectivity on port 443 outbound to the Systems Manager service.
2. This connection can be to a public service endpoint (i.e. over the internet) or it could connect over private endpoints in the VPC.
3. The node needs a profile with the correct privileges to connect over the network to the service and establish a persistent connection.

**Note:** Default local user: `ssm-user.` For Linux: /etc/sudoers and Windows: Administrators group.

### Establishing a connection with Session Manager

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-8.png "Session Manager")

1. A user wants to connect remotely to that node then user has to attempt to "Start Session" with the node. ****
2. Session Manager will check that the user is allowed to "Start Session" on that particular EC2 instance.
3. IAM will check the privileges of the User/Principal.
4. The node is made aware of the authorized connection request over its persistent connection to the AWS Systems Manager.
5. The node then establishes a encrypted tunnel back to the request user via the AWS Session Manager service.

### Session Manager Preferences

The Session Manager preferences offers a place to configure session manager preferences at Region level in that account. Any changes will apply to all sessions in that account/Region unless the setting is overridden (e.g. by passing in a specific setting from the command line.)

* **Session duration/timeout**: The minimum duration for an AWS Session Manager session is 1 minute, and the maximum is 1,440 minutes (24-hours). In addition to the maximum duration you can configure the Idle Session Timeout to end the session after a period of inactivity defined as at least 1 minute and a maximum of 60-minutes.
* **Session encryption settings**: AWS KMS key encryption to provide additional protection to the data transmitted between client machines and managed nodes. Some System Manager features (e.g. reset node user password) require AWS KMS encryption to be in place.
* **Run As support for Linux/MacOS:** The Run As feature makes it possible to start sessions using the credentials of a specified operating system user instead of the credentials of a system-generated ssm-user account that AWS Systems Manager Session Manager can create on a managed node (although RunAs is only available for Linux and MacOS nodes).
* **Session logging for audit and reporting**: Configure Session Manager to create and send session history logs to an Amazon Simple Storage Service (Amazon S3) bucket or an Amazon CloudWatch Logs log group. The stored log data can then be used to audit or report on the session connections made to your managed nodes and the commands run on them during the sessions.
* **Shell profiles/preferences**: Customizable profiles allow you to define preferences within sessions such as shell preferences, environment variables, working directories, and running multiple commands when a session is started.

### Session Encryption

* Session are encrypted by default with TLS 1.2
  * You can enable an additional layer of encryption using KMS keys
* Some Fleet Manager actions, like password resets, require KMS encryption to be enabled
* Sessions encrypted with KMS will have a message displayed once the session has started

**Note:** To add an extra layer of encryption with KMS, you will need to add the KMS encryption key to the preference setting. IAM permissions are required by both the managed node and the user to use Session Manager. Adding KMS encryption will increase the privileges you must assign the node and user.

### Session Logging

In the preferences settings, you can enable session loggings. Session logs are a recording of all commands issued and results displayed during a terminal session. You can send them to CloudWatch or S3 or both.

This allows you to use encrypted log groups and S3 buckets. The actual encryption settings of these resources will happen in CloudWatch and S3. Access to the S3 buckets and the CW log groups will need to be granted to the  EC2 Instance Profile along with privileges such as "s3:GetEncryptionConfiguration". For CloudWatch logging, you can stream logs as they are entered (which is the recommended option) or send logs at the end of session.

**Note:** If you have the **PowerShell Transcription** policy setting configured on your Windows Server managed nodes, you ***will not***  be able to stream session data to CloudWatch or S3. And if you're using Linux or macOS managed nodes, ensure that the screen utility is installed. If it isn't, your log data might be truncated.

* CloudWatch logging will allow Session Manager to record each command issued and the results displayed to the user in CloudWatch for audit purposes. Using this information (and also the Session Manager events recorded to CloudTrail) the customer can link an IAM identity to the commands run using the ssm-user local user on a server.
  * Streamed logs are stored in json format
* The "Session History" tab of AWS Systems Manager Session Manager offers a direct link from an individual Session Manager to session to the CloudWatch logs or S3 record of the session.
* You will need to make sure that the necessary IAM role with required permissions to SSM, CloudWatch and S3 are in place to record session logging.

For more information, visit [Getting started creating an IAM role with permissions for Session Manager and Amazon S3 and CloudWatch Logs](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging).

### How session preferences are applied

* SSM-SessionManagerRunShell document is created with the provided settings and applied to the account in that region
* Custom preferences can be configured using SessionManagerRunShell.json and then create the document SSM-SessionManagerRunShell passing the json file
* Update the preferences by updating the SessionManagerRunShell.json  file and running Update-document API to update SSM-SessionManagerRunShell document

For more information on session preferences, visit [Getting started with configuring preference](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-configure-preferences-cli.html).

### What are the different ways to connect to an instance using Session Manager?

1. **Standard Session:** Connect from EC2 console (Connect to Instance) or Fleet Manager (Start terminal Session) or you can choose to connect via RDP for Windows in both consoles.
    1. A Standard Session opens a terminal command line session. For linux, it opens a shell and for windows, it opens a powershell session.
    2. ssm-user is created the first time a session starts on the instance. And Automatically added to Admin group on windows and sudoers on linux

**Note:** If a user is deleted, the SSM agent wont recreate it and it will cause session manger to fail to connect.

1. **SSH:** SSH tunnels allow you to forward connections made to a local port to a remote machine through a secure channel.
    1. Only via AWS CLI
    1. Requires SSH key
        1. Enables copying files via SCP
    1. Modify SSH configuration file
    1. Logging
        1. No session command logging
        1. Limited to: Session History, CloudTrail

Limitations: Session commands are not logged. This is because SSH encrypts all session data, and Session Manager only serves as a tunnel for SSH connections. You can use Session History and CloudTtrail to look at sessions.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-10.png "Session Manager")

1. **Port forwarding:**
    1. Only via AWS CLI and the session manager plugin
        1. Including CloudShell!
    1. Enables tunneling use case
        1. Tunnel to EC2, RDS, Fargate, ElastiCache
    1. Enables RDP via Fleet Manager
        1. Logging
        1. No session command logging
        1. Limited to: Session History & CloudTrail

**Note:** Logging isn't available for Session Manager sessions that connect through port forwarding or SSH. This is because SSH encrypts all session data, and Session Manager only serves as a tunnel for SSH connections.

The value you specify for portNumber represents the remote port on the managed node where traffic should be redirected to, such as 80  If this parameter isn't specified, Session Manager assumes 80 as the default remote port.

The value you specify for localPortNumber represents the local port on the client where traffic should be redirected to, such as 56789. This value is what you enter when connecting to a managed node using a client. For example, localhost:56789.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-11.png "Session Manager")

### Restricting Access for Standard Sessions

There are two elements you are able to control access to your nodes using the least privilege principal offered by IAM.
You can restriction what the user account employed by Session Manager is allowed to do on an instance or you can restrict which instances the IAM principal of the user is allowed to start a session with.

With Windows managed nodes, users can connect via RDP sessions using any windows user available to them (e.g. an AD user if the node is domain connected). However, if users are connecting using a Terminal Session then the only option is the ssm-user. To restrict what the ssm-user can do on a Windows node, the admin/ user can change which groups the ssm-user is a member of (by default it is a member of the Administrators group).

With Linux managed nodes, a user can configure the "Run As" preference to change the user that a terminal session connects as. By default this is ssm-user with sudo-er privileges. Using "Run As" the user could change ssm-user to a different default user.

Or alternatively, you can specify a tag that is used to determine what user can to connect as based on the value of that tag is set on an IAM user role.

**Note:** If you use IAM Identity Center and permission sets to control user access and an IAM Identity Centre user cannot set a tag, making Run As less flexible for those users.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-9.png "Session Manager")

### How About EC2 Instance Connect?

Where Session Manager is about securing and simplifying remote connections to nodes over an outbound authenticated and authorized link to AWS Session Manager, "EC2 Instance Connect" is about simplifying inbound SSH connections to EC2 Linux hosts.

EC2 Instance Connect simplifies SSH management by generating and using short-lived SSH keys shared through the EC2 meta-data service with the instance. It requires that the user attempting the remote connection have inbound network access on port 22 and finally EC2 Instance Connect only applies to Linux hosts running in EC2 compared with Session Manager working cross-platform and cross-cloud.

## Fleet Manager

Fleet Manager provides a unifying console for all nodes in an account in a Region (and you can change Regions to have a similar view in other Regions). You can see meta-data such as if they’re connected to System Manager, the version of the agent, etc. Allowing an operator to perform common administration tasks across platforms in a unified console improves system administrator efficiency.

![Fleet Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-12.png "Fleet Manager")

### Use cases for Fleet manager

* Perform a variety of common systems administration tasks without having to manually connect to your managed nodes.
* Centralized UI to remotely manage servers: You can see different platform instances  with their state, SSM agent status, platform. Can download the report from the UI for management purpose.
  * Manage nodes running on multiple platforms from a single unified console.
  * Manage nodes running different operating systems from a single unified console.
* Improve the efficiency of your systems administration.

### How does Fleet Manager interact with nodes?

Fleet Manager invokes documents prefixed with ```AWSFleetManager-*```. Documents use either Run Command or Session Manager to get the results and display it in the Fleet Manager console.
