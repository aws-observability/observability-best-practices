# Creation de metriques personnalisees avec le SDK AWS pour Rust

## Introduction

Rust, un langage de programmation systeme axe sur la securite, les performances et la concurrence, gagne en popularite dans le monde du developpement logiciel. Son approche unique de la gestion de la memoire et de la securite des threads en fait un choix attrayant pour construire des applications robustes et efficaces, particulierement dans le cloud. Avec l'essor des architectures serverless et le besoin de services haute performance et scalables, les capacites de Rust en font un excellent choix pour construire des applications cloud-natives. Dans ce guide, nous explorerons comment exploiter le SDK AWS pour Rust afin de creer des metriques CloudWatch personnalisees, vous permettant d'obtenir des informations plus approfondies sur les performances et le comportement de vos applications au sein de l'ecosysteme AWS.

## Prerequis

Pour utiliser ce guide, nous devrons installer Rust et creer un groupe de logs CloudWatch et un flux de logs pour stocker certaines des donnees que nous utiliserons plus tard.

### Installation de Rust

Sur Mac ou Linux :

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Sur Windows, telechargez et executez [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe)

### Creation d'un groupe de logs et d'un flux de logs CloudWatch

1. Creer le groupe de logs CloudWatch :

```
aws logs create-log-group --log-group-name rust_custom
```

2. Creer le flux de logs CloudWatch :

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## Le code

Vous pouvez trouver le code complet dans la section sandbox de ce depot.

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

Ce code va d'abord simuler un lancer de de, nous pretendrons que la valeur de ce lancer de de nous interesse en tant que metrique personnalisee. Nous montrerons ensuite 3 facons differentes d'ajouter la metrique a CloudWatch et de la visualiser sur un tableau de bord.

### Configuration de l'application

Nous devons d'abord importer quelques crates a utiliser dans notre application.

```rust
use crate::cloudwatch::types::Dimension;
use crate::cloudwatchlogs::types::InputLogEvent;
use aws_sdk_cloudwatch as cloudwatch;
use aws_sdk_cloudwatch::config::BehaviorVersion;
use aws_sdk_cloudwatch::types::MetricDatum;
use aws_sdk_cloudwatchlogs as cloudwatchlogs;
use rand::prelude::*;
use serde::Serialize;
use serde_json::json;
use std::time::{SystemTime, UNIX_EPOCH};
```

Dans ce bloc d'importation, nous importons principalement les bibliotheques du SDK AWS que nous utiliserons. Nous integrons egalement le crate 'rand' pour pouvoir creer une valeur de lancer de de aleatoire. Enfin, nous avons quelques bibliotheques comme 'serde' et 'time' pour gerer une partie de la creation de donnees que nous utilisons pour remplir nos appels SDK.

Nous pouvons maintenant creer notre valeur de lancer de de dans notre fonction principale, cette valeur sera utilisee par les 3 appels SDK AWS que nous effectuerons.

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

Maintenant que nous avons notre numero de lancer de de, explorons 3 facons differentes d'ajouter la valeur a CloudWatch en tant que metrique personnalisee. Une fois que la valeur est une metrique personnalisee, nous avons la possibilite de configurer des alarmes sur la valeur, de configurer la detection d'anomalies, de tracer la valeur sur un tableau de bord, et bien plus encore.

### Put Metric Data

La premiere methode que nous utiliserons pour ajouter la valeur a CloudWatch est PutMetricData. En utilisant PutMetricData, nous ecrivons la valeur de serie temporelle de la metrique directement dans CloudWatch. C'est la facon la plus efficace d'ajouter la valeur. Lorsque nous utilisons PutMetricData, nous devons fournir l'espace de noms, ainsi que toutes les dimensions a chaque appel SDK AWS en plus de la valeur de la metrique. Voici le code :

Nous allons d'abord configurer une fonction qui prend notre metrique (valeur du lancer de de) et retourne un type Result, qui en Rust indique le succes ou l'echec. La premiere chose que nous faisons dans la fonction est d'initialiser notre client SDK AWS pour Rust. Notre client heritera des identifiants et de la region de l'environnement local. Assurez-vous donc que ceux-ci sont configures en executant `aws configure` depuis votre ligne de commande avant d'executer ce code.

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);
```

Apres avoir initialise notre client, nous pouvons commencer a configurer l'entree necessaire pour notre appel API PutMetricData. Nous devons definir les dimensions puis le MetricDatum lui-meme, qui est la combinaison des dimensions et de la valeur.

```rust
//Use fluent builders to build the required input for pmd call, starting with dimensions.
let dimensions = Dimension::builder()
    .name("roll_value_pmd_dimension")
    .value(roll_value.to_string())
    .build();

let put_metric_data_input = MetricDatum::builder()
    .metric_name("roll_value_pmd")
    .dimensions(dimensions)
    .value(f64::from(roll_value))
    .build();
```

Enfin, nous pouvons effectuer l'appel API PutMetricData en utilisant l'entree que nous avons definie precedemment.

```rust
let response = client
    .put_metric_data()
    .namespace("rust_custom_metrics")
    .metric_data(put_metric_data_input)
    .send()
    .await?;
println!("Metric Submitted: {:?}", response);
Ok(())
```
Notez que l'appel SDK est dans une fonction asynchrone. Puisque la fonction se termine de maniere asynchrone, nous devons `await` sa completion. Ensuite, nous retournons le type Result tel que defini au niveau superieur de notre fonction.

Quand il est temps d'appeler notre fonction depuis main, cela ressemblera simplement a ceci :

```rust
//call the put_metric_data function with the roll value
println!("First we will write a custom metric with PutMetricData API call");
put_metric_data(roll_value).await.unwrap();
```
Encore une fois, nous attendons que l'appel de fonction se termine puis nous `unwrap` la valeur car dans notre cas, nous ne nous interessons qu'au resultat 'Ok' et non a l'erreur. Dans un scenario de production, vous gererez probablement les erreurs differemment.

### PutLogEvent + Metric Filter

La prochaine facon de creer une metrique personnalisee est de simplement l'ecrire dans un groupe de logs CloudWatch. Une fois la metrique dans un groupe de logs CloudWatch, nous pouvons utiliser un [Metric Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html) pour extraire les donnees de metrique des donnees de log.

Nous allons d'abord definir une structure pour nos messages de log. C'est optionnel, car nous pourrions simplement construire manuellement un JSON. Mais dans une application plus complexe, vous voudriez probablement cette structure de journalisation pour la reutilisabilite.

```rust
//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

Une fois notre structure definie, nous sommes prets a effectuer notre appel API AWS. Encore une fois, nous allons creer un client API, cette fois en utilisant le SDK de logs. Nous definirons egalement le temps systeme en utilisant le temps epoch Unix.

```rust
//Create a reusable aws config that we can pass to our clients
let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

//Create a cloudwatch logs client
let client = cloudwatchlogs::Client::new(&config);

//Let's get the time in ms from unix epoch, this is required for CWlogs
let time_now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_millis() as i64;
```

Nous allons d'abord creer du JSON a partir d'une nouvelle instanciation de notre structure definie plus tot. Puis utiliser cela pour creer un evenement de log.

```rust
let log_json = json!(DicerollValue {
    welcome_message: String::from("Hello from rust!"),
    roll_value
});

let log_event = InputLogEvent::builder()
    .timestamp(time_now)
    .message(log_json.to_string())
    .build();
```

Maintenant nous pouvons completer notre appel API de maniere similaire a ce que nous avons fait avec PutMetricData.

```rust
let response = client
    .put_log_events()
    .log_group_name("rust_custom")
    .log_stream_name("diceroll_log_stream")
    .log_events(log_event.unwrap())
    .send()
    .await?;

println!("Log event submitted: {:?}", response);
Ok(())
```

Une fois l'evenement de log soumis, nous devons aller dans CloudWatch et creer un Metric Filter pour le groupe de logs afin d'extraire correctement la metrique.

Dans la console CloudWatch, allez au groupe de logs rust_custom que nous avons cree. Puis creez un Metric Filter. Le motif de filtre devrait etre `{$.roll_value = *}`. Puis pour la valeur de metrique, utilisez `$.roll_value`. Vous pouvez utiliser n'importe quel espace de noms et nom de metrique de votre choix. Ce Metric Filter peut etre explique ainsi :

"Declencher le filtre chaque fois que nous obtenons un champ appele 'roll_value', quelle que soit la valeur. Une fois declenche, utiliser la 'roll_value' comme nombre a ecrire dans CloudWatch Metrics".

Cette facon de creer des metriques est tres puissante pour extraire des valeurs de series temporelles a partir de donnees de log lorsque vous n'avez pas de controle sur le formatage des logs. Puisque nous instrumentons directement le code, nous avons le controle sur le format de nos donnees de log, donc une meilleure methode peut etre d'utiliser CloudWatch Embedded Metric Format, que nous discuterons dans l'etape suivante.

### PutLogEvent + Embedded Metric Format

CloudWatch [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) (EMF) est un moyen d'integrer des metriques de series temporelles directement dans vos logs. CloudWatch extraira ensuite les metriques sans avoir besoin de Metric Filters. Examinons le code.

Creez a nouveau un client de logs avec la recuperation du temps systeme en epoch Unix.

```rust
//Create a reusable aws config that we can pass to our clients
let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

//Create a cloudwatch logs client
let client = cloudwatchlogs::Client::new(&config);

//get the time in unix epoch ms
let time_now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_millis() as i64;
```

Maintenant nous pouvons creer notre chaine JSON EMF. Celle-ci doit contenir toutes les donnees necessaires pour que CloudWatch cree la metrique personnalisee, donc nous integrons l'espace de noms, les dimensions et la valeur dans la chaine.

```rust
//Create a json string in embedded metric format with our diceroll value.
let json_emf = json!(
    {
        "_aws": {
        "Timestamp": time_now,
        "CloudWatchMetrics": [
            {
            "Namespace": "rust_custom_metrics",
            "Dimensions": [["roll_value_emf_dimension"]],
            "Metrics": [
                {
                "Name": "roll_value_emf"
                }
            ]
            }
        ]
        },
        "roll_value_emf_dimension": roll_value.to_string(),
        "roll_value_emf": roll_value
    }
);
```

Remarquez comment nous creons en fait une dimension a partir de notre valeur de lancer ainsi qu'en l'utilisant pour la valeur. Cela nous permet d'effectuer un GroupBy sur la valeur du lancer afin de voir combien de fois chaque valeur de lancer a ete obtenue.

Maintenant nous pouvons effectuer l'appel API pour ecrire l'evenement de log comme nous l'avons fait auparavant :

```rust
let log_event = InputLogEvent::builder()
    .timestamp(time_now)
    .message(json_emf.to_string())
    .build();

let response = client
    .put_log_events()
    .log_group_name("rust_custom")
    .log_stream_name("diceroll_log_stream_emf")
    .log_events(log_event.unwrap())
    .send()
    .await?;

println!("EMF Log event submitted: {:?}", response);
Ok(())
```

Une fois l'evenement de log soumis a CloudWatch, la metrique sera extraite sans avoir besoin d'un Metric Filter. C'est un excellent moyen de creer des metriques a haute cardinalite ou il peut etre plus facile d'ecrire ces valeurs sous forme de messages de log au lieu de faire un appel API PutMetricData avec toutes les differentes dimensions.

### Assembler le tout

Notre fonction main finale appellera les trois appels API comme ceci :

```rust
#[::tokio::main]
async fn main() {
    println!("Let's have some fun by creating custom metrics with the Rust SDK");

    //select a random number 1-6 to represent a dicerolll
    let mut rng = rand::thread_rng();
    let roll_value = rng.gen_range(1..7);

    //call the put_metric_data function with the roll value
    println!("First we will write a custom metric with PutMetricData API call");
    put_metric_data(roll_value).await.unwrap();

    println!("Now let's write a log event, which we will then extract a custom metric from.");
    //call the put_log_data function with the roll value
    put_log_event(roll_value).await.unwrap();

    //call the put_log_emf function with the roll value
    println!("Now we will put a log event with embedded metric format to directly submit the custom metric.");
    put_log_event_emf(roll_value).await.unwrap();
}
```

Pour generer des donnees de test, nous pouvons compiler l'application puis l'executer en boucle pour generer des donnees a visualiser dans CloudWatch. Depuis le repertoire racine, executez la commande suivante :

```
cargo build
```

Maintenant nous allons l'executer 50 fois avec une pause de 2 secondes. La pause sert simplement a espacer un peu les metriques pour les rendre plus faciles a visualiser dans un tableau de bord CloudWatch.

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

Maintenant nous pouvons examiner les resultats dans CloudWatch. J'aime faire un GroupBy sur les dimensions, cela me permet de voir combien de fois chaque valeur de lancer a ete selectionnee. La requete Metric Insights devrait ressembler a ceci. Modifiez le nom de la metrique et le nom de la dimension si vous avez change quelque chose.

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

Maintenant nous pouvons mettre les trois sur un tableau de bord et voir comme prevu le meme graphique.

![dashboard](./dashboard.png)

## Nettoyage

Assurez-vous de supprimer votre groupe de logs `rust_custom`.

```
aws logs delete-log-group --log-group-name rust_custom
```
