# AWS X-Ray
 
## Règles d'échantillonnage

Les règles d'échantillonnage utilisant X-Ray peuvent être configurées dans la console AWS, via un fichier de configuration local, ou les deux. La configuration locale remplacera celles définies dans la console.

:::info
	Utilisez la console X-Ray, l'API ou CloudFormation dans la mesure du possible. Cela vous permet de modifier le comportement d'échantillonnage d'une application au moment de l'exécution.
:::
Vous pouvez définir des taux d'échantillonnage séparément pour chacun de ces critères :

* Nom du service (par ex. facturation, paiements)
* Type de service (par ex. EC2, conteneur)
* Méthode HTTP
* Chemin d'URL
* ARN de ressource
* Hôte (par ex. www.example.com)

La meilleure pratique est de définir un taux d'échantillonnage qui collecte suffisamment de données pour diagnostiquer les problèmes et comprendre les profils de performance, sans collecter tellement de données que cela devienne ingérable. Par exemple, échantillonner 1 % du trafic vers une page d'accueil, mais 10 % des requêtes vers une page de paiement, s'alignerait bien avec une pratique d'observabilité solide.

Certaines transactions, vous pourriez souhaiter les capturer à 100 %. Soyez toutefois prudent car les traces ne sont pas destinées à des audits forensiques d'accès à votre charge de travail !

:::warning
	Comme les traces ne sont pas destinées à être utilisées pour l'audit ou l'analyse forensique, évitez les taux d'échantillonnage de 100 %. Cela peut créer une fausse attente que X-Ray (utilisant par défaut un émetteur UDP) ne perdra jamais une trace de transaction.
:::
En règle générale, la capture de traces de transaction ne devrait jamais créer une charge onéreuse pour votre personnel ou votre facture AWS. Ajoutez des traces à votre environnement progressivement pendant que vous apprenez le volume de données que votre charge de travail émet.

:::info
	Par défaut, le SDK X-Ray enregistre la première requête chaque seconde, et cinq pour cent de toute requête supplémentaire.
	Définissez toujours une taille de réservoir que vous pouvez tolérer. La taille du réservoir détermine le nombre maximum de requêtes par seconde que vous capturerez. Cela vous protège contre les attaques malveillantes, les frais indésirables et les erreurs de configuration.
:::
## Configuration du daemon

Le daemon X-Ray est destiné à décharger l'effort d'envoi de la télémétrie vers le plan de données X-Ray pour analyse. En tant que tel, il ne devrait pas consommer trop de ressources sur le serveur, le conteneur ou l'instance sur lequel l'application source s'exécute.

:::info
	La meilleure pratique est d'exécuter le daemon X-Ray sur une autre instance ou un autre conteneur, appliquant ainsi la séparation des préoccupations et permettant à votre système source de ne pas être encombré.
:::

:::info
	Dans un modèle d'orchestration de conteneurs, tel que Kubernetes, faire fonctionner votre daemon X-Ray en tant que sidecar est une pratique courante.
:::
Le daemon a des paramètres par défaut sûrs et peut fonctionner dans des environnements EC2, ECS, EKS ou Fargate sans configuration supplémentaire dans la plupart des cas. Pour les environnements hybrides et autres environnements cloud cependant, vous pouvez souhaiter ajuster le `Endpoint` pour refléter un [VPC endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) si vous utilisez un Direct Connect ou un VPN pour intégrer vos environnements distants.

:::tip
	Si vous devez exécuter le daemon X-Ray sur la même instance ou machine virtuelle que l'application source, envisagez de définir le paramètre `TotalBufferSizeMB` pour vous assurer que X-Ray ne consomme pas plus de ressources système que vous ne pouvez vous le permettre.
:::
## Annotations

AWS X-Ray prend en charge l'envoi de métadonnées arbitraires avec vos traces. Celles-ci sont appelées *annotations*. C'est une fonctionnalité puissante qui vous permet de regrouper vos traces de manière logique. Les annotations sont également indexées, ce qui facilite la recherche de traces relatives à une seule entité.

Lorsque vous utilisez des SDK d'auto-instrumentation pour X-Ray, les annotations peuvent ne pas apparaître automatiquement. Vous devez les ajouter à votre code, ce qui enrichit considérablement vos traces et crée des moyens pour vous de générer des X-Ray Insights, des métriques basées sur vos annotations, des alarmes et des modèles de détection d'anomalies à partir du comportement de votre système, et d'automatiser la création de tickets et la remédiation lorsqu'un composant impactant vos utilisateurs est observé.

:::info
	Utilisez les annotations pour comprendre le flux de données dans votre environnement.
:::

:::info
	Créez des alarmes basées sur la performance et les résultats de vos traces annotées.
:::
