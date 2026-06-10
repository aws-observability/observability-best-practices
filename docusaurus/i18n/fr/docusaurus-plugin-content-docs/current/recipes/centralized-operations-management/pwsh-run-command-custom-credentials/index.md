---
sidebar_position: 1
---

# Exécution de commandes PowerShell en tant qu'utilisateur Windows personnalisé dans Systems Manager Run Command

Par défaut, [Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html) utilise le compte local `SYSTEM` pour exécuter des commandes sur les noeuds gérés Windows. Cependant, dans certains scénarios, les ingénieurs d'exploitation ont besoin de permissions utilisateur personnalisées lors de l'exécution de commandes. Par exemple, pour exécuter des tâches Active Directory Domain ou pour restreindre les privilèges de la session de commande.

Lors de la manipulation des informations d'identification utilisateur dans PowerShell, nous recommandons de les stocker dans [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) et de les récupérer de manière programmatique depuis le script. Cela évite d'exposer les informations d'identification en texte clair à tout moment de l'exécution.

:::info
Le noeud géré doit avoir les permissions d'accéder au secret dans Secrets Manager. Les permissions peuvent être accordées au profil d'instance IAM EC2 attaché, au rôle de service IAM spécifié dans votre paramètre de service [Default Host Management Configuration](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-default-host-management-configuration.html) (DHMC), ou au rôle de service IAM pour le [noeud géré hybride](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-hybrid-multicloud.html). Pour plus d'informations, consultez [Exemples de politiques IAM pour les secrets dans AWS Secrets Manager](https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html).
:::

L'exemple ci-dessous montre un script pour récupérer les informations d'identification de domaine depuis Secrets Manager et exécuter un script PowerShell avec ces informations d'identification :

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

La sortie dans Run Command montre la connexion réussie en tant qu'utilisateur de domaine souhaité :

![Run Command output with CredSSP](/img/cloudops/recipes/pwsh-run-command-custom-credentials/example-1-command-output.png)

Une autre alternative consiste à utiliser PowerShell Session (`PSSession`). Le code suivant utilise également Secrets Manager pour récupérer les informations d'identification de l'administrateur local et exécuter une commande dans ce contexte :

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

L'image ci-dessous montre la sortie de Run Command après l'exécution de ce script PowerShell :

![Run Command output with PSSession](/img/cloudops/recipes/pwsh-run-command-custom-credentials/example-2-command-output.png)

:::note
Le secret Secrets Manager utilisé dans ces exemples stocke les informations d'identification au format clé/valeur suivant :

```json
{"username":"XXXXXXXXX","password":"XXXXXXX"}
```

:::

Plus de détails sur la création d'un secret Secrets Manager [ici](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html).

## Utiliser un document Run Command personnalisé pour assumer automatiquement des informations d'identification personnalisées et exécuter un script PowerShell

Pour automatiser la récupération du secret et la manipulation des informations d'identification, vous pouvez [créer](https://aws.amazon.com/blogs/mt/writing-your-own-aws-systems-manager-documents/) un document Run Command personnalisé avec le contenu ci-dessous :

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

En conséquence, vous disposerez d'un document modèle qui ne nécessite que l'ARN du secret et le contenu du script pour chaque invocation :

![Custom Run Command Doc settings](/img/cloudops/recipes/pwsh-run-command-custom-credentials/custom-command-doc-settings.png)

Une invocation de commande réussie affichera les résultats suivants :

![Custom Run Command Doc output](/img/cloudops/recipes/pwsh-run-command-custom-credentials/custom-command-doc-output.png)
