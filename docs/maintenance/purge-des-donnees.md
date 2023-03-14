# Purge des données

**Respectez les prérequis avant de commencer**

## Contexte d'utilisation

- Lorsque des données sont corrompues et que l'origine est introuvable. 

## Commande à lancer

Vous avez la possibilité de supprimer l'ensemble des données des contextes suivants :

| Contexte   |     Subcommand    | Actif |
| :--------- | :---------------- | :---: |
| Evènements | purge-events      |       |
| Logements  | purge-housing-ads |   X   |
| Stage      | purge-internships |   X   |

Pour ce faire vous devez lancer la commande suivante : 

```bash
$ scalingo -a ${SCALINGO_APP} run "npm run cli -- maintain ${SUBCOMMAND}"
```

Après avoir purgé les données, relancer les crons du contexte en utilisant les commandes de chargement associées à ce dernier.
