---
sidebar_position: 1
---

# Systems Manager Run Command లో custom Windows user గా PowerShell commands ను invoke చేయడం

డిఫాల్ట్‌గా, [Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html) Windows managed nodes పై commands రన్ చేయడానికి local `SYSTEM` account ను ఉపయోగిస్తుంది. అయితే, కొన్ని సందర్భాలలో, operations engineers commands రన్ చేసేటప్పుడు custom user permissions అవసరం. ఉదాహరణకు, Active Directory Domain tasks రన్ చేయడానికి లేదా command session కోసం privileges ని scope down చేయడానికి.

PowerShell లో user credentials ను handle చేసేటప్పుడు, వాటిని [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) లో store చేసి script నుండి programmatically retrieve చేయడం మేము సిఫార్సు చేస్తాము. ఇది execution యొక్క ఏ సమయంలోనైనా credentials ను plain text లో expose చేయకుండా నిరోధిస్తుంది.

:::info
Managed node కు Secrets Manager లోని secret ని access చేయడానికి permissions ఉండాలి. Permissions ను attach చేయబడిన EC2 IAM instance profile కి, మీ [Default Host Management Configuration](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-default-host-management-configuration.html) (DHMC) service setting లో specify చేయబడిన IAM service role కి, లేదా [hybrid managed node](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-hybrid-multicloud.html) కోసం IAM service role కి grant చేయవచ్చు. మరింత సమాచారం కోసం, [IAM policy examples for secrets in AWS Secrets Manager](https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html) చూడండి.
:::

Secrets Manager నుండి Domain credentials ను retrieve చేసి ఆ credentials తో PowerShell script రన్ చేయడానికి ఒక script ఉదాహరణ క్రింద ఉంది:

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

Run Command లో output కావలసిన domain user గా విజయవంతమైన login ను చూపిస్తుంది:

![Run Command output with CredSSP](/img/cloudops/recipes/pwsh-run-command-custom-credentials/example-1-command-output.png)

మరొక ప్రత్యామ్నాయం PowerShell Session (`PSSession`) ఉపయోగించడం. కింది code కూడా Local Administrator credentials retrieve చేయడానికి Secrets Manager ను ఉపయోగిస్తుంది మరియు ఈ context లో command రన్ చేస్తుంది:

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

ఈ PowerShell script రన్ చేసిన తర్వాత Run Command output ను క్రింది చిత్రం చూపిస్తుంది:

![Run Command output with PSSession](/img/cloudops/recipes/pwsh-run-command-custom-credentials/example-2-command-output.png)

:::note
ఈ ఉదాహరణలలో ఉపయోగించిన Secrets Manager secret కింది key/value pair format లో credentials ను store చేస్తుంది:

```json
{"username":"XXXXXXXXX","password":"XXXXXXX"}
```

:::

Secrets Manager secret సృష్టించడం గురించి మరింత వివరాలు [ఇక్కడ](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html) కనుగొనవచ్చు.

## Custom credentials ను స్వయంచాలకంగా assume చేసి PowerShell script రన్ చేయడానికి custom Run Command document ఉపయోగించడం

Secret retrieval మరియు credentials manipulations ను automate చేయడానికి, మీరు కింది content తో custom Run Command document ను [సృష్టించవచ్చు](https://aws.amazon.com/blogs/mt/writing-your-own-aws-systems-manager-documents/):

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

ఫలితంగా, మీకు ప్రతి invocation కోసం Secret ARN మరియు script content మాత్రమే అవసరమయ్యే template document ఉంటుంది:

![Custom Run Command Doc settings](/img/cloudops/recipes/pwsh-run-command-custom-credentials/custom-command-doc-settings.png)

విజయవంతమైన command invocation కింది ఫలితాలను చూపిస్తుంది:

![Custom Run Command Doc output](/img/cloudops/recipes/pwsh-run-command-custom-credentials/custom-command-doc-output.png)
