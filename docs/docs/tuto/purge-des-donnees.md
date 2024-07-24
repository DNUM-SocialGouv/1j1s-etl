---
sidebar_label: Comment purger les données ?
sidebar_position: 2
---

# Purge des données

_20 Avril 2023 (mis à jour le 24 Juillet 2024)_

:::info Contexte
Des données sont corrompues et que l'origine est introuvable, il convient peut être d'effectuer une purge des données.
:::

:::danger Pré-requis
Avoir un token permettant l'accèes à l'application sur scalingo
:::

## Procédure de purge

### Vérifier les variables d'environnements

```env

SCALINGO_APP=${APP_NAME}

```

### Commandes à exécuter

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
