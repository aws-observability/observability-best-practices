# Logs

Les logs fournissent des informations riches et contextuelles sur les événements de votre application. Ils sont essentiels pour le débogage et la compréhension de ce qui s'est mal passé.

Cette section fournit des recettes pouvant être utilisées comme meilleures pratiques pour émettre et envoyer des logs depuis les applications .NET vers le service de logs natif d'AWS - Amazon CloudWatch Logs.

### Diffuser les logs depuis des fichiers de logs sur des instances Amazon EC2 ou des serveurs sur site vers Amazon CloudWatch Logs

Vous pouvez utiliser cette approche lorsque vos applications .NET existantes écrivent des logs dans des fichiers et que vous souhaitez utiliser Amazon CloudWatch Logs pour le stockage et l'analyse des logs sans aucune modification de votre code.

**Étape 1 :** Installez l'agent CW sur l'instance Amazon EC2 ou le serveur sur site où votre application s'exécute. Les instructions d'installation de l'agent CW sont disponibles [**ici**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html).

**Étape 2 :** Ensuite, nous devons fournir les permissions à l'agent CloudWatch pour écrire des logs dans CloudWatch. Vous créez un rôle IAM, un utilisateur IAM, ou les deux pour accorder les permissions nécessaires à l'agent CloudWatch pour écrire des logs dans CloudWatch. Si vous prévoyez d'utiliser l'agent sur des instances Amazon EC2, vous devez créer un rôle IAM. Si vous prévoyez d'utiliser l'agent sur des serveurs sur site, vous devez créer un utilisateur IAM. **CloudWatchAgentServerPolicy** est une politique IAM gérée par AWS qui inclut les permissions nécessaires pour écrire des logs dans CloudWatch.

[**Suivez ces instructions**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html) pour fournir les permissions à l'agent CW.

**Étape 3 :** Avant d'exécuter l'agent CloudWatch sur un serveur, vous devez créer un ou plusieurs fichiers de configuration de l'agent CloudWatch. Le fichier de configuration de l'agent est un fichier JSON qui spécifie les métriques, logs et traces que l'agent doit collecter et où les envoyer (comme quel groupe de logs ou espace de noms dans CloudWatch). Vous pouvez le créer en [**utilisant un assistant**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html) ou en [**le créant vous-même**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) depuis zéro.

Le fichier de configuration de l'agent comporte quatre sections : agent, metrics, logs et traces. Vous pouvez fournir les identifiants que vous avez créés précédemment (étape 2) dans la section **agent**. La section **logs** spécifie quels fichiers de logs sont publiés dans CloudWatch Logs. Cela peut inclure les événements du journal des événements Windows si le serveur exécute Windows Server. Des instructions détaillées pour configurer les sections **agent** et **logs** sont disponibles [**ici**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html).

**Étape 4 :** Une fois que tout est en place, vous pouvez [**démarrer l'agent CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem).

### Utiliser le AWS SDK for .NET pour écrire des logs depuis les applications .NET vers CloudWatch Logs

Si vous souhaitez écrire des logs directement dans Amazon CloudWatch Logs en utilisant les API du service, vous pouvez le faire en utilisant le AWS SDK for .NET.

Le [**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) fournit des bibliothèques qui facilitent le développement d'applications .NET interagissant avec les services AWS. Les bibliothèques sont fournies sous forme de packages NuGet.

Pour interagir avec Amazon CloudWatch Logs, vous devrez utiliser la classe AmazonCloudWatchLogsClient fournie par le package NuGet AWSSDK.CloudWatchLogs.

**Étape 1 :** Installez le package NuGet AWS CloudWatch Logs

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**Étape 2 :** Configurez les identifiants AWS

Assurez-vous que votre application dispose des permissions nécessaires pour écrire dans CloudWatch Logs. Soit en assignant un rôle IAM, en utilisant un fichier d'identifiants AWS, ou en configurant des variables d'environnement. Par exemple, la politique ci-dessous fournit les permissions pour créer des groupes de logs et des flux de logs ainsi que pour y écrire des logs.

```json
{
    "Effect": "Allow",
    "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
    ],
    "Resource": "*"
}
```

**Étape 3 :** Initialisez le client CloudWatch Logs. Les espaces de noms et classes ci-dessous font partie du package NuGet AWSSDK.CloudWatchLogs.

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**Étape 4 :** Créez un groupe de logs et un flux de logs si nécessaire. Vous pouvez en savoir plus sur les concepts Amazon CloudWatch Logs tels que les groupes de logs et les flux de logs [**ici**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html).

```csharp
string logGroupName = "MyAppLogGroup";
string logStreamName = "MyAppLogStream";

// Create Log Group (skip if already exists)
try
{
    await client.CreateLogGroupAsync(new CreateLogGroupRequest
    {
        LogGroupName = logGroupName
    });
}
catch (ResourceAlreadyExistsException) { }

// Create Log Stream (skip if already exists)
try
{
    await client.CreateLogStreamAsync(new CreateLogStreamRequest
    {
        LogGroupName = logGroupName,
        LogStreamName = logStreamName
    });
}
catch (ResourceAlreadyExistsException) { }
```

**Étape 5 :** Envoyez vos logs à Amazon CloudWatch Logs

```csharp
var logEvents = new List<InputLogEvent>
{
    new InputLogEvent
    {
        Message = "Hello CloudWatch from .NET!",
        Timestamp = DateTime.UtcNow
    }
};

var putLogRequest = new PutLogEventsRequest
{
    LogGroupName = logGroupName,
    LogStreamName = logStreamName,
    LogEvents = logEvents
};

await client.PutLogEventsAsync(putLogRequest);
```

### Utiliser des frameworks de journalisation .NET populaires pour envoyer des logs structurés à Amazon CloudWatch Logs

Bien que l'utilisation d'AmazonCloudWatchLogsClient offre beaucoup de flexibilité et un accès API de bas niveau à CloudWatch Logs, elle génère une quantité importante de code répétitif. De plus, il existe plusieurs frameworks de journalisation tiers populaires dans la communauté des développeurs .NET pour la journalisation structurée avec lesquels AmazonCloudWatchLogsClient ne s'intègre pas nativement.

Le dépôt [**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) contient des plugins pour bon nombre de ces fournisseurs de frameworks de journalisation populaires afin de s'intégrer avec Amazon CloudWatch Logs. Le [**dépôt**](https://github.com/aws/aws-logging-dotnet) contient des informations détaillées sur la façon de connecter votre application qui utilise le framework ILogger standard ASP.NET, NLog, Apache log4net ou Serilog pour envoyer des logs à Amazon CloudWatch Logs.

### Journalisation dans les fonctions AWS Lambda

https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/

https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/


### PowerTools pour Lambda

https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc
