# Exemples de requêtes CloudWatch Logs Insights

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) fournit une plateforme puissante pour analyser et interroger les données de logs CloudWatch. Il vous permet de rechercher interactivement dans vos données de logs en utilisant un langage de requête de type SQL avec quelques commandes simples mais puissantes.

CloudWatch Logs Insights fournit des exemples de requêtes prêts à l'emploi pour les catégories suivantes :

- Lambda
- VPC Flow Logs
- CloudTrail
- Requêtes communes
- Route 53
- AWS AppSync
- NAT Gateway

Dans cette section du guide de bonnes pratiques, nous fournissons quelques exemples de requêtes pour d'autres types de logs qui ne sont pas actuellement inclus dans les exemples prêts à l'emploi. Cette liste évoluera et changera au fil du temps et vous pouvez soumettre vos propres exemples pour examen en créant une [issue](https://github.com/aws-observability/observability-best-practices/issues) sur GitHub.

## API Gateway

### 20 derniers messages contenant un type de méthode HTTP

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

Cette requête retournera les 20 derniers messages de log contenant une méthode HTTP spécifique, triés par horodatage décroissant. Substituez **METHOD** par la méthode que vous recherchez. Voici un exemple d'utilisation de cette requête :

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    Vous pouvez modifier la valeur de $limit afin de retourner un nombre différent de messages.
:::

### Top 20 des sources de trafic triées par IP

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

Cette requête retournera les 20 plus grandes sources de trafic triées par IP. Cela peut être utile pour détecter une activité malveillante contre votre API.

En guise de prochaine étape, vous pourriez ajouter un filtre supplémentaire par type de méthode. Par exemple, cette requête montrerait les plus grandes sources de trafic par IP mais uniquement pour l'appel de méthode "PUT" :

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## Logs CloudTrail

### Erreurs de throttling API regroupées par catégorie d'erreur

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

Cette requête vous permet de voir les erreurs de throttling API regroupées par catégorie et affichées par ordre décroissant.

:::tip
    Pour utiliser cette requête, vous devez d'abord vous assurer que vous [envoyez les logs CloudTrail vers CloudWatch.](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
:::
    
### Activité du compte root en graphique linéaire

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

Avec cette requête, vous pouvez visualiser l'activité du compte root dans un graphique linéaire. Cette requête agrège l'activité root au fil du temps, comptant les occurrences d'activité root dans chaque intervalle de 5 minutes.
:::tip
     [Visualiser les données de logs en graphiques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### Filtrage des flow logs pour une adresse IP source sélectionnée avec action REJECT.

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

Cette requête retournera les 20 derniers messages de log contenant un 'REJECT' provenant de la $SOURCEIP. Cela peut être utilisé pour détecter si le trafic est explicitement rejeté, ou si le problème est un type de problème de configuration réseau côté client.

:::tip
    Assurez-vous de substituer la valeur de l'adresse IP qui vous intéresse à '$SOURCEIP'
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### Regroupement du trafic réseau par zones de disponibilité

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

Cette requête récupère les données de trafic réseau regroupées par zone de disponibilité (AZ). Elle calcule le trafic total en mégaoctets (Mo) en additionnant les octets et en les convertissant en Mo. Les résultats sont ensuite triés par ordre décroissant en fonction du volume de trafic dans chaque AZ.


### Regroupement du trafic réseau par direction du flux

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

Cette requête est conçue pour analyser le trafic réseau regroupé par direction de flux. (Entrant ou Sortant)


### Top 10 des transferts de données par adresses IP source et destination

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

Cette requête récupère les 10 principaux transferts de données par adresses IP source et destination. Cette requête permet d'identifier les transferts de données les plus significatifs entre des adresses IP source et destination spécifiques.

## Logs Amazon SNS

### Nombre d'échecs de messages SMS par raison

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

La requête ci-dessus liste le nombre d'échecs de livraison triés par raison dans l'ordre décroissant. Cette requête peut être utilisée pour identifier les raisons des échecs de livraison.

### Échecs de messages SMS dus à un numéro de téléphone invalide

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

Cette requête retourne les messages qui échouent à la livraison en raison d'un numéro de téléphone invalide. Cela peut être utilisé pour identifier les numéros de téléphone qui doivent être corrigés.

### Statistiques d'échec de messages par type de SMS

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

Cette requête retourne le nombre, le temps d'attente moyen et les dépenses pour chaque type de SMS (Transactionnel ou Promotionnel). Cette requête peut être utilisée pour établir des seuils déclenchant des actions correctives. La requête peut être modifiée pour ne filtrer qu'un certain type de SMS, si seul ce type de SMS justifie une action corrective.

### Statistiques de notifications d'échec SNS

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

Cette requête retourne le nombre, le temps d'attente moyen et les dépenses pour chaque message en échec. Cette requête peut être utilisée pour établir des seuils déclenchant des actions correctives.



