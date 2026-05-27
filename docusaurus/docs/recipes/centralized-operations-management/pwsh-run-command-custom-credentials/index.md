---
sidebar_position: 1
---

# Invoking PowerShell commands as a custom Windows user in Systems Manager Run Command

By default, [Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html) uses the local `SYSTEM` account to run commands on Windows managed nodes. However, in certain scenarios, operations engineers require custom user permissions when running commands. For example, to run Active Directory Domain tasks or to scope down the privileges for the command session.

When handling user credentials in PowerShell, we recommend storing them in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) and retrieving them programmatically from the script. This avoids exposing the credentials in plain text at any point of the execution.

:::info
The managed node must have permissions to access the secret in Secrets Manager. Permissions can be granted to the EC2 IAM instance profile attached, the IAM service role specified in your [Default Host Management Configuration](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-default-host-management-configuration.html) (DHMC) service setting, or the IAM service role for the [hybrid managed node](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-hybrid-multicloud.html). For more information, see [IAM policy examples for secrets in AWS Secrets Manager](https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html).
:::

The below example shows a script to retrieve Domain credentials from Secrets Manager and run a PowerShell script with those credentials:

```powershell showLineNumbers
# Retrieves AWS Secrets Manager secret
$SecretContent = Get-SECSecretValue -SecretId <SECRET_ARN> -ErrorAction Stop | Select-Object -ExpandProperty 'SecretString' | ConvertFrom-Json -ErrorAction Stop

# Creates credentials object
$Username = $SecretContent.username
$UserPassword = ConvertTo-SecureString ($SecretContent.password) -AsPlainText -Force
$Credentials = New-Object -TypeName 'System.Management.Automation.PSCredential' ($Username, $UserPassword)

# Run commands with Domain Credentials
Invoke-Command -Authentication 'CredSSP' `
    -ComputerName $env:COMPUTERNAME `
    -Credential $Credentials `
    -ScriptBlock {Write-Host "Logged in as:"$(whoami)}
```

The output in Run Command shows the successful log in as the desired domain user:

![Run Command output with CredSSP](/img/cloudops/recipes/pwsh-run-command-custom-credentials/example-1-command-output.png)

Another alternative is using PowerShell Session (`PSSession`). The following code also uses Secrets Manager to retrieve Local Administrator credentials and run a command under this context:

```powershell showLineNumbers
# Retrieves AWS Secrets Manager secret
$SecretContent = Get-SECSecretValue -SecretId <SECRET_ARN> -ErrorAction Stop | Select-Object -ExpandProperty 'SecretString' | ConvertFrom-Json -ErrorAction Stop

# Creates credentials object
$Username = $SecretContent.username
$UserPassword = ConvertTo-SecureString ($SecretContent.password) -AsPlainText -Force
$Credentials = New-Object -TypeName 'System.Management.Automation.PSCredential' ("$Env:ComputerName\$Username", $UserPassword)

# Creates a new PowerShell session on the local computer using provided credentials
$Session = New-PSSession -ComputerName $Env:ComputerName -Credential $Credentials -ErrorAction Stop

# Runs a command in the remote session to start a process and wait for completion
Invoke-Command -Session $Session -ScriptBlock { Write-Host "Logged in as: $env:USERNAME" }
```

The below image shows the Run Command output after running this PowerShell script:

![Run Command output with PSSession](/img/cloudops/recipes/pwsh-run-command-custom-credentials/example-2-command-output.png)

:::note
The Secrets Manager secret used on these examples stores credentials in the following key/value pair format:

```json
{"username":"XXXXXXXXX","password":"XXXXXXX"}
```

:::

Find more details on creating a Secrets Manager secret [here](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html).

## Use a custom Run Command document to automatically assume custom credentials and run a PowerShell script

To automate the secret retrieval and credentials manipulations, you can [create](https://aws.amazon.com/blogs/mt/writing-your-own-aws-systems-manager-documents/) a custom Run Command document with the below content:

```yaml
schemaVersion: '2.2'
description: "Command document example to retrieve a secret from AWS Secrets Manager and run a PowerShell command using the credentials"
parameters:
  SecretId:
    type: String
    description: The ARN or name of the secret to retrieve. To retrieve a secret from another account, you must use an ARN.
    default: Secret ARN or Name
  Command:
    type: String
    description: "Run a PowerShell script."
    default: Write-Host "Logged in as:"$(whoami)
    displayType: textarea
mainSteps:
  - action: aws:runPowerShellScript
    name: ExecutePowerShellCommand
    inputs:
      runCommand:
        - |
           # Retrieves AWS Secrets Manager secret
            $SecretContent = Get-SECSecretValue -SecretId {{SecretId}} -ErrorAction Stop | Select-Object -ExpandProperty 'SecretString' | ConvertFrom-Json -ErrorAction Stop
  
            # Creates credentials object
            $Username = $SecretContent.username
            $UserPassword = ConvertTo-SecureString ($SecretContent.password) -AsPlainText -Force
            $Credentials = New-Object -TypeName 'System.Management.Automation.PSCredential' ("$Env:ComputerName\$Username", $UserPassword)
  
            # Creates a new PowerShell session on the local computer using provided credentials
            $Session = New-PSSession -ComputerName $Env:ComputerName -Credential $Credentials -ErrorAction Stop
  
            # Runs a command in the remote session to start a process and wait for completion
            Invoke-Command -Session $Session -ScriptBlock { {{Command}} } -ErrorAction Stop
```

As a result, you will have a template document which only requires Secret ARN and script content for each invocation:

![Custom Run Command Doc settings](/img/cloudops/recipes/pwsh-run-command-custom-credentials/custom-command-doc-settings.png)

A successful command invocation will show the following results:

![Custom Run Command Doc output](/img/cloudops/recipes/pwsh-run-command-custom-credentials/custom-command-doc-output.png)
