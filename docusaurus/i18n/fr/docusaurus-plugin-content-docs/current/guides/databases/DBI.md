# Surveillance des bases de donnees avec Amazon CloudWatch Database Insights

## Introduction

Amazon CloudWatch Database Insights est une solution de surveillance unifiee pour les bases de donnees Amazon RDS et Aurora. Elle consolide les metriques de base de donnees, l'analytique des requetes, les logs, les evenements et la telemetrie applicative en une seule experience au sein de la console CloudWatch, eliminant ainsi le besoin de basculer entre plusieurs outils pour comprendre ce qui se passe dans votre couche de base de donnees.

Cet article couvre ce qu'offre Database Insights, comment choisir entre ses deux modes de fonctionnement, des conseils pratiques pour surveiller efficacement vos bases de donnees, et les limitations dont vous devez etre conscient avant de l'adopter.

---

## Qu'est-ce que Database Insights ?

Database Insights s'appuie sur Amazon RDS Performance Insights et l'etend avec une surveillance a l'echelle de la flotte, la correlation des logs, l'analyse des verrous, la capture des plans d'execution et l'integration au niveau applicatif. C'est le successeur de l'experience autonome de la console Performance Insights (qui atteint sa fin de vie prochainement).

Le concept central est le **DB Load** -- le nombre moyen de sessions actives dans votre base de donnees a tout moment. Si le DB Load depasse le nombre de vCPUs de votre instance, votre base de donnees est surchargee. Database Insights visualise cette metrique et vous permet de la decouper selon plusieurs dimensions (SQL, evenements d'attente, utilisateurs, hotes, applications) pour identifier rapidement la cause profonde des problemes de performance.

---

## Mode Standard vs Mode Avance

Database Insights fonctionne en deux niveaux. Le mode Standard est active par defaut sans cout supplementaire. Le mode Avance necessite l'activation de Performance Insights avec une retention de 15 mois et est tarife en fonction des heures-vCPU (provisionne) ou des heures-ACU (serverless/limitless).

| Fonctionnalite | Standard | Avance |
|---|:---:|:---:|
| Analyser les principaux contributeurs au DB Load par dimension | ✔ | ✔ |
| Interroger, grapher et alerter sur les metriques (retention 7 jours) | ✔ | ✔ |
| Controle d'acces IAM detaille pour les dimensions sensibles | ✔ | ✔ |
| Vues de surveillance a l'echelle de la flotte | ✘ | ✔ |
| Analyse des processus OS (Enhanced Monitoring) | ✘ | ✔ |
| Analyse des verrous SQL (retention 15 mois) | ✘ | ✔ (Aurora PG) |
| Analyse des plans d'execution SQL (retention 15 mois) | ✘ | ✔ (Aurora PG, Oracle, SQL Server) |
| Visualisation des statistiques par requete | ✘ | ✔ |
| Analyse des requetes SQL lentes | ✘ | ✔ |
| Integration Application Signals (services appelants) | ✘ | ✔ |
| Tableau de bord de telemetrie consolide (metriques, logs, evenements) | ✘ | ✔ |
| Import automatique des metriques compteur Performance Insights | ✘ | ✔ |
| Evenements RDS dans CloudWatch | ✘ | ✔ |
| Rapports d'analyse de performance a la demande | ✘ | ✔ |
| Surveillance inter-comptes et inter-regions | ✘ | ✔ |

**Retention des donnees :**
- Standard : 7 jours pour les donnees Performance Insights.
- Avance : 15 mois pour toutes les metriques collectees par Database Insights.

---

## Fonctionnalites cles expliquees

### Tableau de bord de sante de la flotte

Le tableau de bord de sante de la flotte fournit une vue d'ensemble de toutes vos instances RDS et Aurora inter-comptes et inter-regions sur un seul ecran. Une visualisation en nid d'abeilles categorise les instances par etat de sante (Eleve, Avertissement, Ok, Inactif) base sur le DB Load par rapport a la capacite vCPU. Vous pouvez filtrer par tags (environnement, service, equipe) et sauvegarder des vues de flotte personnalisees. Les graphiques Top-10 montrent les instances les plus chargees, leurs principales requetes et les principaux evenements d'attente en un coup d'oeil.

C'est la ou vous commencez lorsque vous etes responsable de centaines de bases de donnees et que vous devez identifier rapidement laquelle necessite une attention.

### Analyse du DB Load (l'atelier d'investigation)

L'onglet Analyse du DB Load du tableau de bord de l'instance est l'endroit ou vous passez la plupart de votre temps de depannage. Il repond aux cinq questions :

- **QUOI** -- Decoupez par SQL pour voir quelles requetes generent la charge.
- **QUI** -- Decoupez par Utilisateur ou Application pour identifier le responsable.
- **OU** -- Decoupez par Hote pour trouver la machine source.
- **QUAND** -- La chronologie montre exactement quand les problemes ont commence et se sont arretes.
- **POURQUOI** -- Correlez les resultats et prenez des mesures.

Le tableau Top SQL classe les requetes par contribution a la charge et affiche les appels/sec, la latence moyenne, les lignes examinees et le nombre de plans.

### Analyse des verrous

Disponible pour Aurora PostgreSQL et RDS for PostgreSQL. Database Insights capture des instantanes de verrous toutes les 15 secondes et les visualise sous forme d'arbres de verrous -- les noeuds parents sont les sessions bloquantes, les noeuds enfants sont les sessions en attente. Vous pouvez voir le SQL bloquant, la duree et le nombre de sessions en aval affectees. L'option "Sliced by: Blocking SQL" dans le graphique DB Load montre quelles instructions provoquent la contention de verrous au fil du temps.

### Analyse des plans d'execution

Disponible pour Aurora PostgreSQL (v14.10+, v15.5+), RDS for Oracle et RDS for SQL Server. La colonne Plans Count dans le tableau Top SQL montre combien de plans d'execution distincts existent pour chaque requete. Vous pouvez comparer les plans cote a cote pour identifier quand un changement de plan a provoque une regression de performance. Un nombre eleve de plans signale une instabilite de l'optimiseur.

### Telemetrie de base de donnees

Un onglet consolide contenant :
- **Metriques** -- Tableau de bord personnalisable des metriques CloudWatch, OS et compteur moteur.
- **Logs** -- Logs de base de donnees exportes vers CloudWatch Logs, consultables en ligne.
- **Processus OS** -- CPU/memoire par processus depuis Enhanced Monitoring.
- **Requetes SQL lentes** -- Requetes lentes groupees par modele, classees par frequence.
- **Evenements** -- Evenements operationnels RDS (basculements, maintenance, changements de configuration).

### Services appelants (integration CloudWatch Application Signals)

Cette integration de surveillance des performances applicatives montre quels microservices en amont appellent votre base de donnees, avec leur disponibilite, latence, taux d'erreur et volume de requetes. Cela comble l'ecart entre "la base de donnees est lente" et "ce service et cette fonction specifiques en sont la cause."

### Analyse de performance a la demande

Selectionnez n'importe quelle fenetre temporelle et declenchezen une analyse automatisee basee sur le ML en choisissant "Analyze Performance" depuis le graphique Database Load. Database Insights exploite des modeles de machine learning pour comparer la periode selectionnee au comportement de base normal de votre base de donnees, en analysant les dimensions (instructions SQL, evenements d'attente, hotes, utilisateurs, et plus) pour faire emerger les anomalies et les causes profondes (par exemple, "le DB load a augmente de 4x en raison d'un changement d'evenement d'attente du CPU vers les E/S"). Chaque rapport inclut des conclusions priorisees avec des conseils de remediation specifiques, reduisant le temps moyen de diagnostic de quelques heures a quelques minutes. Les rapports sont conserves aux cotes de votre historique de metriques de 15 mois pour une consultation facile lors des revues post-incident.

---

## Limitations

Avant d'adopter Database Insights, soyez conscient des contraintes suivantes :

### Disponibilite par moteur et fonctionnalite

- L'**analyse des verrous** est uniquement disponible pour Aurora PostgreSQL et RDS for PostgreSQL.
- L'**analyse des plans d'execution** est uniquement disponible pour Aurora PostgreSQL (v14.10+/v15.5+), RDS for Oracle et RDS for SQL Server.
- Toutes les fonctionnalites du mode Avance ne sont pas disponibles dans toutes les regions AWS.
- Le support d'Aurora PostgreSQL Limitless Database existe mais avec un ensemble reduit de fonctionnalites (pas d'analyse des verrous ni des plans d'execution au niveau du groupe de shards).

### Exigences en matiere de donnees et de configuration

- L'**analyse SQL lente** necessite l'activation de l'export des logs de base de donnees vers CloudWatch Logs et la configuration des parametres DB appropriees (par exemple, `log_min_duration_statement` pour PostgreSQL, `slow_query_log` pour MySQL).
- Les **donnees de processus OS** necessitent l'activation d'Enhanced Monitoring (cout supplementaire).
- Les **plans d'execution** sur Aurora PostgreSQL necessitent le parametre `aurora_compute_plan_id` defini sur `on`. Les plans reels (vs estimes) necessitent en plus `aurora_stat_plans.with_analyze`.
- Les **Services appelants** necessitent que vos applications soient instrumentees avec CloudWatch Application Signals.
- `pg_stat_statements` est charge par defaut sur Aurora PostgreSQL 10+, mais le texte SQL est tronque a `track_activity_query_size` (par defaut 1 024 octets). Les requetes longues peuvent apparaitre incompletes.

### Limitations operationnelles

- Les instantanes d'analyse des verrous sont pris toutes les 15 secondes -- les verrous de tres courte duree peuvent ne pas etre captures.
- Le tableau de bord de sante de la flotte necessite le mode Avance pour les vues de flotte sauvegardees.
- La surveillance inter-comptes necessite la configuration de CloudWatch Observability Access Manager (OAM) dans les comptes de surveillance et source.
- Les rapports d'analyse de performance sont supprimes lorsque leur heure de debut depasse la periode de retention.
- Les personnalisations du tableau de bord dans l'onglet Telemetrie de base de donnees s'appliquent par type de moteur par region par compte -- pas par instance.

### Considerations de cout

- Le mode Avance est tarife par heure-vCPU (provisionne) ou heure-ACU (serverless/limitless). Pour les grandes flottes, les couts peuvent etre significatifs.
- Enhanced Monitoring entraine des frais separes.
- Les couts d'ingestion et de stockage CloudWatch Logs s'appliquent lorsque l'export des logs est active.
- Il n'y a pas de moyen d'activer le mode Avance pour des instances individuelles au sein d'un cluster -- cela s'applique a l'ensemble du cluster DB.

---

## Bonnes pratiques

### Commencez par Standard, mettez a niveau strategiquement

Le mode Standard est gratuit et vous offre l'analyse du DB Load avec une retention de 7 jours. Activez le mode Avance sur les bases de donnees critiques en production ou vous avez besoin d'une retention de 15 mois, de vues de flotte, d'analyse des verrous ou de capture des plans d'execution. Toutes les instances de developpement/test n'ont pas besoin du mode Avance.

### Taguez vos instances de maniere coherente

Les vues de flotte de Database Insights filtrent par tags. Adoptez une strategie de tagging coherente (par exemple, `environment`, `service`, `team`) pour pouvoir creer des vues de flotte significatives comme "toutes les bases de donnees de production pour le service de paiement."

### Activez l'export des logs tot

L'analyse SQL lente et la section Logs de la telemetrie de base de donnees ne fonctionnent que si vous avez active l'export des logs vers CloudWatch Logs. Faites-le au moment de la creation de l'instance plutot que retroactivement -- vous ne pouvez pas analyser les requetes lentes historiques d'avant l'activation de l'export.

### Configurez des alarmes sur le DB Load

Creez des alarmes CloudWatch sur la metrique `DBLoad` par rapport au nombre de vCPUs de votre instance. Un DB Load soutenu au-dessus du nombre de vCPUs signifie que les sessions sont en file d'attente. Alertez avant que les clients ne le remarquent.

### Utilisez le cadre Qui/Quoi/Ou/Quand

Lors de l'investigation d'un probleme de performance, parcourez le menu deroulant "Sliced by" systematiquement :
1. **SQL** -- identifiez la requete problematique.
2. **Application** ou **Utilisateur** -- identifiez qui l'execute.
3. **Hote** -- identifiez d'ou cela provient.
4. **Chronologie** -- identifiez quand cela a commence.

Cette approche structuree vous empeche de vous perdre dans des investigations sans fin.

### Activez la capture des plans d'execution pour Aurora PostgreSQL

Definissez `aurora_compute_plan_id = on` dans votre groupe de parametres de cluster. Les regressions de plan sont l'une des causes les plus courantes de degradation soudaine des performances, et sans capture de plan vous naviguez a l'aveugle. La surcharge est minimale.

### Utilisez l'analyse a la demande pour les revues post-incident

Apres tout incident de performance, generez un rapport d'analyse de performance pour la fenetre temporelle affectee. Il fournit un resume automatise que vous pouvez joindre a votre COE ou post-mortem, et il est conserve pendant 15 mois.

### Exploitez la surveillance inter-comptes pour les architectures multi-comptes

Si votre organisation utilise des comptes AWS separes pour differents services ou environnements, configurez l'observabilite inter-comptes CloudWatch avec OAM. Cela permet a un compte de surveillance central de voir le tableau de bord de sante de la flotte a travers tous les comptes et regions -- essentiel pour les equipes plateforme gerant une infrastructure de base de donnees partagee.

### Restreignez l'acces au texte SQL

Utilisez des politiques IAM pour restreindre l'acces a la dimension texte SQL. Les requetes de base de donnees peuvent contenir des donnees sensibles (identifiants clients, adresses email dans les clauses WHERE). Accordez la visibilite SQL complete uniquement aux DBA et limitez les autres roles aux metriques agregees.

---

## Conseils prescriptifs : ce que vous devriez faire aujourd'hui

### Si vous debutez :

1. **Verifiez que le mode Standard est actif** -- il devrait l'etre par defaut. Naviguez vers CloudWatch -> Insights -> Database Insights et confirmez que vous voyez vos instances.
2. **Activez l'export des logs** vers CloudWatch Logs pour vos bases de donnees de production.
3. **Configurez des alarmes CloudWatch** sur `CPUUtilization`, `DatabaseConnections` et `DBLoad`.
4. **Taguez vos instances** avec les tags environnement, service et equipe.

### Si vous executez des charges de travail de production :

1. **Activez le mode Avance** sur les clusters de production -- la retention de 15 mois et les vues de flotte valent le cout pour la production.
2. **Activez Enhanced Monitoring** pour la visibilite au niveau OS.
3. **Definissez `aurora_compute_plan_id = on`** (Aurora PostgreSQL) pour la capture des plans d'execution.
4. **Creez des vues de sante de flotte** filtrees par vos tags de production.
5. **Instrumentez vos applications** avec CloudWatch Application Signals pour activer la vue Services appelants.

### Si vous gerez une grande flotte :

1. **Configurez la surveillance inter-comptes et inter-regions** avec OAM.

   Fonctionnement d'OAM :
   - **Compte de surveillance** -- Le compte central ou votre equipe visualise les tableaux de bord. Vous creez un "sink" ici qui accepte les donnees des autres comptes.
   - **Comptes source** -- Les comptes qui executent reellement vos bases de donnees. Vous creez des "links" depuis chaque compte source vers le sink du compte de surveillance, lui accordant la permission de lire leurs donnees CloudWatch.

   Une fois lies, le compte de surveillance peut voir les metriques, logs et traces de tous les comptes source comme s'ils etaient locaux -- y compris le tableau de bord de sante de la flotte Database Insights affichant les instances de tous les comptes lies et regions en une seule vue.
2. **Creez plusieurs vues de flotte** segmentees par equipe, service ou environnement.
3. **Etablissez un flux de travail de triage** : Sante de la flotte -> identifier l'instance problematique -> Analyse du DB Load -> qui/quoi/ou/quand -> agir.
4. **Executez des analyses a la demande periodiques** sur vos instances a plus fort trafic pour detecter les regressions lentes avant qu'elles ne deviennent des incidents.

---

## Conclusion

CloudWatch Database Insights consolide ce qui necessitait auparavant plusieurs outils -- Performance Insights, CloudWatch Metrics, CloudWatch Logs, la console RDS -- en une seule experience guidee. Le mode Standard vous offre une visibilite immediate sans cout. Le mode Avance ajoute la profondeur necessaire pour une surveillance de production serieuse : vues de flotte, arbres de verrous, plans d'execution, analyse des requetes lentes et retention de 15 mois.

Le changement de mentalite cle est de passer d'un mode reactif ("la base de donnees est lente, laissez-moi me connecter en SSH et executer des requetes sur pg_stat_activity") a un mode proactif ("je peux voir la sante de toute ma flotte, approfondir n'importe quelle instance, et repondre a qui/quoi/ou/quand en moins de deux minutes depuis une seule console"). Database Insights rend ce flux de travail possible sans outillage personnalise ni solutions tierces.

---

## References

- [Documentation CloudWatch Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)
- [Demarrer avec Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Get-Started.html)
- [Analyse des verrous](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Lock-Analysis.html)
- [Analyse des plans d'execution](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Execution-Plans.html)
- [Tarification Amazon CloudWatch](https://aws.amazon.com/cloudwatch/pricing/)
