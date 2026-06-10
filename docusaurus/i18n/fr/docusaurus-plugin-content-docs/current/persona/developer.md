# Developpeurs
L'Observability est cruciale pour les developpeurs car elle ameliore la productivite, les performances des applications et favorise le succes commercial grace a une meilleure prise de decision et une resolution plus rapide des problemes. Ce guide fournit les meilleures pratiques et recommandations pour exploiter efficacement l'Observability.

## Pourquoi l'Observability est importante pour les developpeurs
Les developpeurs utilisent l'Observability pour plusieurs objectifs cles :
- **Identification et resolution rapides des problemes :**
    - L'Observability permet aux developpeurs d'identifier et de diagnostiquer rapidement les problemes, reduisant le temps de resolution (MTTR) et ameliorant les performances globales de livraison logicielle
    - Elle aide les developpeurs a comprendre comment leurs systemes se comportent en production, leur permettant de prendre des decisions eclairees et d'ameliorer les operations
- **Ameliorer l'experience client :**
    - En analysant le comportement du systeme, les developpeurs peuvent optimiser les performances et la fiabilite, conduisant a de meilleures experiences client et une satisfaction utilisateur accrue
    - Les outils d'Observability aident a surveiller les interactions utilisateur, permettant aux developpeurs d'identifier et de resoudre rapidement les problemes d'UI/UX
- **Efficacite accrue de l'equipe et innovation :**
    - Les plateformes d'Observability fournissent une source unique de verite pour les donnees operationnelles, facilitant la collaboration inter-equipes et reduisant le temps de depannage
    - Les developpeurs peuvent se concentrer davantage sur l'innovation et moins sur le debogage manuel, grace aux informations et alertes automatisees
- **Prise de decision basee sur les donnees :**
    - L'Observability fournit des informations detaillees sur les performances du systeme, permettant aux developpeurs de prendre des decisions basees sur les donnees concernant les ameliorations de code et l'allocation des ressources
    - Elle aide les organisations a optimiser les investissements et a accelerer la mise sur le marche en identifiant les domaines d'amelioration
- **Gestion de la complexite :**
    - L'Observability aide a gerer la complexite des environnements modernes cloud-native et multi-cloud en fournissant une vue complete des interdependances du systeme
    - Elle permet aux developpeurs de distiller la complexite et de se concentrer sur les donnees pertinentes, favorisant des processus de developpement plus efficaces

## Meilleures pratiques pour la qualite du code
- **Surveiller les metriques de suivi des tickets :**
    - Utilisez des outils comme JIRA, Trello ou d'autres plateformes de suivi pour suivre des metriques telles que :
        - Combien de fois un ticket passe de la revue de code a la revue de test et retourne en cours. Un nombre eleve peut indiquer un manque de competences, une complexite elevee ou un outillage inadequat.
        - Combien de fois un ticket est bloque en raison de dependances externes. Un nombre eleve pourrait indiquer un couplage important entre les dependances et/ou une complexite elevee.
    - **Recommandations :**
        - Utilisez un outil comme [Amazon Q Developer](https://aws.amazon.com/q/developer) pour augmenter la productivite et la qualite du code avec des revues de code automatisees. Amazon Q Developer peut accelerer les taches de developpement logiciel jusqu'a 80 %, contribue a un code de meilleure qualite en reduisant la probabilite d'erreur humaine lors de cycles de developpement rapides.
        - Planifiez des revues regulieres des metriques dans le cadre des retrospectives pour identifier les ameliorations et favoriser un etat d'esprit d'amelioration continue
        
- **Instrumenter le code pour les metriques de performance :**
    - Instrumentez votre code pour pouvoir mesurer les elements suivants qui fournissent une mesure indirecte de la qualite du code en evaluant l'efficacite des performances et l'evolutivite de l'implementation du code
        - **Methode RED :** Surveillez les Requetes, Erreurs et Duree pour les microservices. Cela fournit des informations sur les performances et la fiabilite des services.
        - **Methode USE :** Suivez l'Utilisation, la Saturation et les Erreurs pour les ressources systeme. Cela aide a identifier les goulots d'etranglement et les contraintes de ressources.
    - Ajoutez de l'instrumentation autour des appels a toutes les dependances externes dans le chemin de traitement des requetes, comme d'autres services, bases de donnees, cache, etc. Cela peut vous fournir les informations necessaires pour enqueter sur les changements soudains du temps de traitement des requetes ainsi que pour identifier plus rapidement la cause racine d'un probleme
    - **Recommandations :** 
        - Definissez un SLO (Service Level Objective) sur la latence des requetes et le taux d'erreur et utilisez-le pour conduire des ameliorations de qualite et de performance
        - Ajoutez la validation de l'instrumentation aux tests automatises qui exercent les chemins critiques de flux de donnees et de traitement des requetes
        - Construisez une tache de test de charge automatisee pour creer une base de reference des performances systeme et une mesure de la qualite du code
        - Assurez-vous que l'instrumentation a ajoute du contexte pour pouvoir identifier l'impact sur les performances d'une seule requete
        - Configurez et utilisez l'auto-instrumentation fournie par les SDK pour reduire le travail manuel lie a l'ajout d'instrumentation


## Journalisation et surveillance efficaces
- Utilisez des formats de journalisation structures, par exemple JSON. Pour les applications existantes, envisagez d'utiliser les fonctionnalites de transformation des journaux pour injecter plus de contexte, ajouter ou supprimer des champs
- Utilisez un format d'evenement large contenant des metadonnees adequates pour pouvoir deriver des signaux significatifs et effectuer une correlation croisee entre les signaux.
- Utilisez OpenTelemetry ou les SDK ADOT qui injectent du contexte supplementaire dans les journaux, ce qui permet la correlation croisee des signaux et la reduction du temps moyen d'identification (MTTI), reduisant ainsi le temps moyen de recuperation (MTTR)
- Utilisez les niveaux de journalisation de maniere appropriee - ceux-ci peuvent vous aider a controler le volume de journaux et donc le cout d'ingestion.
    - Utilisez ERROR pour toutes les conditions d'erreur inattendues et attendues. Ajoutez autant de contexte supplementaire que possible pour accelerer l'analyse de la cause racine.
    - Utilisez INFO pour les evenements generaux d'execution comme la connexion utilisateur, qui peuvent fournir du contexte et sont importants
    - Utilisez DEBUG pour journaliser les appels dans le chemin de traitement afin d'obtenir une comprehension plus approfondie du flux et des etats de l'application.
- Evitez de journaliser toute donnee pouvant etre consideree comme sensible, comme les PII ou PHI. Lorsque le besoin existe, envisagez d'utiliser la politique de protection des donnees ou de caviarder les donnees lors de l'ingestion. Utilisez les politiques IAM pour controler qui peut voir les donnees brutes.
- Utilisez le format de metrique embarque (EMF) pour integrer des metriques dans les journaux, reduisant le nombre d'appels API vers la plateforme d'Observability et reduisant les couts.
    - Evitez d'utiliser EMF pour les metriques avec des dimensions de haute cardinalite comme requestId
- **Alertes :** 
    - Utilisez la detection d'anomalies pour eviter de definir des seuils rigides pour les alertes. Cela peut eviter la surcharge de mise a jour des seuils a mesure que l'utilisation du systeme change au fil du temps et reduire le bruit d'alerte.
    - Utilisez les calculs mathematiques sur les metriques et les alertes combinees pour reduire le nombre d'alertes individuelles generees pour une defaillance particuliere.
    - N'alertez que lorsqu'un SLO est en risque d'echec ou echoue. Cela peut eviter que votre equipe soit reveillee inutilement et reduire la surcharge cognitive et de contexte
    - N'alertez que si quelqu'un peut agir sur la notification de defaillance
    - Automatisez la resolution de l'alerte lorsque c'est possible. Par exemple, exploitez la configuration native de la plateforme comme l'autoscaling, le basculement automatique vers une replique ou une instance de secours, etc.
    - Ajoutez un contexte adequat a la notification d'alerte pour assurer que la personne notifiee puisse rapidement identifier les tableaux de bord a consulter, le playbook a utiliser et le service impacte
- **Tableaux de bord :**
    - Creez un ou plusieurs tableaux de bord par persona/partie prenante.
        - Les developpeurs d'applications auraient besoin de suffisamment de contexte pour diagnostiquer les problemes, comprendre les performances de l'application
        - Les ingenieurs de plateforme auraient besoin de tableaux de bord avec du contexte pour identifier l'impact sur les SLO et les composants d'infrastructure necessitant une attention et leur impact sur les services les utilisant
        - Les chefs de produit auraient besoin de tableaux de bord montrant le parcours utilisateur, les metriques d'utilisation des fonctionnalites produit, les taux d'adoption, les points d'abandon, etc.
        - Les parties prenantes commerciales seraient interessees par des widgets demontrant les taux d'adoption du produit, la perte d'abonnes ou tout ce qui peut etre lie a l'impact sur les performances commerciales et les revenus
    - Utilisez un fuseau horaire coherent sur tous les tableaux de bord, par exemple UTC
    - Utilisez la meme plage temporelle sur tous les widgets d'un tableau de bord
    - Utilisez des annotations pour ajouter plus de contexte aux tableaux de bord
    - Assurez-vous que seuls les widgets qui ajoutent du contexte pour aider a la resolution des erreurs sont sur le tableau de bord. Trop de widgets peuvent ajouter du bruit et une surcharge cognitive, ce qui conduit a un MTTR plus eleve
        - Deplacez les autres widgets souhaites vers un autre tableau de bord ou vers le bas du tableau de bord s'il n'y a pas deja trop de widgets. Trop de widgets impacteront le temps de chargement et entraineront plus de stress et de surcharge cognitive.
    - Assurez-vous que le tableau de bord entier tient sur un seul ecran et que les tendances sont visibles avec la resolution et la taille d'ecran d'un ordinateur portable
    - Ayez un widget avec une description du tableau de bord et des conseils sur la facon d'utiliser le tableau de bord
    - Configurez et affichez les seuils sur les widgets
    - Ne surchargez pas un seul widget avec plus de metriques, ce qui peut entrainer le lissage des tendances et des pics et annuler l'objectif. Cela rend egalement le diagnostic difficile.
    - Utilisez un axe Y ajuste dynamiquement pour permettre aux tendances et aux pics d'etre visibles
- **Recommandations :**
    - **Controler les couts :**
        - **Identifier les parties prenantes :** 
            - Determinez les differentes personas interessees par les performances des fonctionnalites, telles que la fonctionnalite, la disponibilite, la securite, le cout, les ventes et l'utilisation du produit.
            - Les parties prenantes peuvent inclure les equipes de developpement, les clients finaux, les parties prenantes commerciales internes, les equipes d'operations de plateforme ou les developpeurs d'applications.
        - **Identifier les resultats cles :**
            - Pour chaque partie prenante, definissez des resultats quantifiables (par exemple, taux d'erreur, duree de traitement des requetes, nombre de connexions par minute, nombre de produits achetes par minute, nombre de paniers abandonnes, etc.) qui sont generalement mesures a l'aide de Service Level Objectives (SLO).
            - Utilisez ces SLO par persona pour identifier l'instrumentation requise
        - **Choisir le bon signal :**
            - Un journal large avec suffisamment de contexte peut etre converti en metriques et traces donnant une source unique de verite, controlant les couts et permettant la correlation des signaux
            - Executez un [Atelier de strategie d'Observability](https://catalog.us-east-1.prod.workshops.aws/workshops/e31f4fcc-1944-4e46-815d-26fc9eafabce/en-US/5-practical-examples/5-1petstore-site-exercise/scenario1) pour identifier les bons signaux a instrumenter dans l'application
    - **Choisir le bon signal :**
        - Les journaux et les traces vous aident a trouver la cause racine d'une defaillance ou d'un comportement inattendu. Assurez-vous d'ajouter des journaux qui peuvent vous aider a repondre a des questions comme "pourquoi une requete particuliere a-t-elle echoue ?" ou "que devrais-je savoir pour le SLO lie a la duree des requetes s'il y a une augmentation du p50 ou p99 pour le temps de traitement des requetes ?"
        - Les metriques sont utiles pour comprendre les performances de base, predire les tendances et les anomalies. Elles peuvent proactivement vous donner une indication que quelque chose ne fonctionne pas comme prevu. Les metriques personnalisees sont cependant couteuses.
    - **Reduire la fatigue d'alerte :**
        - Selon la configuration, les alertes peuvent mettre en evidence de maniere proactive ou reactive un probleme dans le systeme. Trop d'alertes peuvent conduire a une fatigue d'alerte et a des equipes inefficaces, entrainant une mauvaise qualite de code et une mauvaise livraison de produit.
    - **Revues periodiques et amelioration continue :**
        - Ayez une rotation periodique pour qu'un membre de l'equipe surveille les tableaux de bord et rapporte toute nouvelle tendance ou modele identifie.
        - Allouez une partie de chaque version a l'amelioration des signaux, l'ajustement des seuils d'alerte et des tableaux de bord en fonction des lacunes identifiees lors des retrospectives et des observations de rotation
        - Priorisez la correction de la cause racine d'une alerte recurrente en fonction de l'effort de resolution et du nombre de fois ou l'alerte se declenche

## Profilage et optimisation des performances
- **Real User Monitoring (RUM) :**
    - Utilisez des outils comme [AWS X-Ray](https://aws.amazon.com/xray/) ou New Relic pour surveiller les interactions reelles des utilisateurs et identifier les goulots d'etranglement de performance. Concentrez-vous sur les points de conversion cles et mesurez a la fois les performances techniques et les resultats commerciaux (taux de conversion, points d'abandon).
    - Priorisez la surveillance des parcours utilisateur critiques comme les flux de paiement et les processus d'inscription.
    - Etablissez des performances de base et un comportement utilisateur de reference pour pouvoir rapidement identifier les anomalies et les tendances pouvant impacter les resultats commerciaux
- **Synthetics :**
    - Utilisez des outils comme [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) pour simuler les interactions utilisateur et tester les performances de l'application dans diverses conditions. Les canaris synthetiques peuvent aider a identifier les problemes avant que l'impact utilisateur ne soit detecte.
    - Validez les verifications de sante et la disponibilite du systeme avec des canaris synthetiques.
- **Outils de profilage :**
    - Utilisez des outils comme [AWS X-Ray](https://aws.amazon.com/xray/) pour le profilage afin d'identifier les goulots d'etranglement de performance et d'optimiser l'utilisation des ressources
    - Definissez des taux d'echantillonnage dynamiques qui s'ajustent en fonction des modeles de trafic et maintenez une retention adequate des traces d'erreur et des valeurs aberrantes. Cela assure une visibilite complete sur les problemes critiques tout en gerant le volume de donnees et les couts efficacement.
    - Utilisez l'echantillonnage en queue pour configurer votre collecteur avec plusieurs politiques d'echantillonnage qui priorisent les traces de haute valeur en fonction du statut d'erreur, des seuils de duree et des attributs personnalises. Cela garantira que les traces echantillonnees incluent celles qui seront de la plus grande valeur
- **OpenTelemetry :**
    - Utilisez [OpenTelemetry](https://opentelemetry.io/) pour l'auto-instrumentation afin de simplifier la collecte de metriques de performance et de traces. Validez la telemetrie fournie par l'auto-instrumentation avant d'ajouter une instrumentation manuelle, puis cherchez a ajuster l'auto-instrumentation en fonction des exigences pour controler les signaux et les couts.

## Gestion des erreurs et techniques de debogage
- **General :**
    - Concevez des mecanismes de nouvelle tentative avec un backoff exponentiel pour les defaillances transitoires. Implementez des [disjoncteurs](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html) pour les dependances externes. Cela est particulierement utile dans les systemes distribues et empeche une charge excessive sur le composant/service en aval. Cela peut ne pas etre applicable dans tous les scenarios, donc effectuez une diligence raisonnable avant d'adopter cette conception.
    - Creez des mecanismes de repli pour les operations critiques et maintenez des procedures de retour en arriere claires pour les transactions echouees.
    - Ajoutez une validation des entrees a tous les points d'entree.
    - Assurez-vous que les operations pouvant etre reessayees sont idempotentes.
- **Journalisation :**
    - Maintenez un repertoire de requetes [CloudWatch Log Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) sauvegardees. Utilisez des dossiers pour regrouper les requetes
    - Ne masquez pas les erreurs. Journalisez ou gerez toujours de maniere appropriee.
    - Ajoutez une forme d'identification comme un identifiant de correlation ou un identifiant de requete aux journaux en plus de tout autre contexte pertinent.
- **Playbooks et runbooks :**
    - Lors de la redaction des playbooks, incluez des etapes actionnables claires avec les permissions requises, les outils et les resultats attendus.
    - Incluez des etapes de verification, des procedures de retour en arriere et des liens vers les tableaux de bord pertinents dans les playbooks et runbooks.
    - Versionnez les playbooks et mettez-les a jour apres les incidents, y compris les apprentissages et les informations cles.
- **Ajustement des regles d'echantillonnage :**
    - Implementez des regles d'echantillonnage dynamiques basees sur la criticite du service et les modeles de trafic.
    - Definissez des taux d'echantillonnage plus eleves pour les conditions d'erreur et les chemins critiques pour l'entreprise.
    - Revoyez et ajustez regulierement les regles d'echantillonnage en fonction des besoins operationnels et des considerations de cout.

## Revues de code et strategies de collaboration
- **Elaboration des tickets :**
    - Identifiez les exigences d'Observability dans le cadre du processus d'elaboration des fonctionnalites. Cela peut inclure :
        - Les parties prenantes impactees et les SLO associes
        - La telemetrie/signaux requis
        - Les alertes requises
        - La liste des tableaux de bord a creer ou mettre a jour
- **Retrospectives sans blame :**
    - Apres chaque incident, menez une retrospective sans blame pour rechercher des opportunites d'ameliorer les processus ou d'ajouter de l'automatisation. Tenez toujours compte du cout du changement et assurez-vous de quitter chaque exercice post-mortem avec au moins un element actionnable convenu qui a egalement un delai d'achevement associe.
- **Revues de preparation operationnelle :**
    - Participez aux revues de preparation operationnelle avec l'equipe de plateforme et d'operations pour identifier les lacunes dans la posture d'Observability - cela peut etre une liste de verification et un exercice obligatoire avant les deploiements en production. Pour les grandes organisations avec plusieurs equipes, pour eviter que ce processus devienne un goulot d'etranglement, effectuez-les periodiquement, par nouvelle fonctionnalite et cadence de version.
- **Recommandations :**
    - Utilisez un outil comme [AWS Systems Manager Incident Manager](https://docs.aws.amazon.com/incident-manager/latest/userguide/analysis.html) pour vous guider dans l'analyse post-incident
    - Consultez la [revue de preparation operationnelle](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html) pour vous inspirer des questions a inclure dans votre liste de verification ou processus de revue de preparation operationnelle.
    - Partagez toujours les apprentissages des retrospectives et des revues de preparation operationnelle - cela pourrait se faire via un wiki ou des abonnements a une liste de diffusion

## Directives de conception et de documentation des API
- **Versionnement :**
    - Assurez-vous que les API sont versionnees et que la version est ajoutee comme contexte pour chaque requete traitee
    - Lorsque vous envoyez des metriques personnalisees, ajoutez une dimension sur la version si applicable
    - Ajoutez une annotation ou un identifiant sur les tableaux de bord pour distinguer clairement un basculement d'une version a une autre
    - Assurez-vous de suivre les requetes vers chaque version et un widget pour visualiser l'utilisation des versions. Ceci permet de s'assurer que les requetes sont acheminees comme prevu et aussi de reduire le temps d'identification de la cause racine. Cela peut fournir une confiance accrue lors de la depreciation et de la suppression d'une version plus ancienne
- **Compatibilite ascendante :**
    - Assurez-vous qu'il n'y a pas de requetes vers les versions plus anciennes avant de supprimer les chemins de code lies a une version API plus ancienne
- **API par lots :**
    - Emettez des signaux pour le statut de chaque requete individuelle ainsi que pour la requete par lots globale
    - Assurez-vous que le contexte est ajoute aux journaux identifiant l'identifiant de la requete par lots et la requete individuelle
