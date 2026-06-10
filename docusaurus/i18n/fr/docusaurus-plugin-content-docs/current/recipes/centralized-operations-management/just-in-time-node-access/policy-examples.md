---
sidebar_position: 4
---

# Exemples de politiques Cedar pour JITNA

Cette section contient une collection d'exemples de politiques lors de l'utilisation de l'acces juste-a-temps aux noeuds (JITNA) de Systems Manager. Les exemples sont concus pour montrer aux clients AWS comment implementer des politiques Cedar pour autoriser ou interdire l'acces automatique aux demandes de session d'acces juste-a-temps.

Pour plus d'informations sur le schema pour l'acces juste-a-temps aux noeuds, consultez [Statement structure and built-in operators for auto-approval and deny-access policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html). En savoir plus sur la redaction de politiques Cedar dans le [Cedar playground](https://www.cedarpolicy.com/en/playground).

Veuillez garder a l'esprit qu'il s'agit de code d'exemple qui doit etre soigneusement teste et valide dans un environnement de developpement avant toute utilisation dans un environnement de production.

## Autoriser l'acces automatique aux noeuds de production pour le groupe IDC d'astreinte

L'exemple suivant autorise l'acces automatique pour :

* Toute identite aux noeuds de developpement, identifies par la paire cle-valeur de tag `Environment:DEV`.
* Les utilisateurs du groupe AWS Identity Center (IDC) **OnCall** pour acceder aux noeuds de production, identifies par la paire cle-valeur de tag `Environment:PROD`.

```language=cedar
// Permit automatic access to DEV nodes
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };

// Permit automatic access to PROD nodes for OnCall users
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```
