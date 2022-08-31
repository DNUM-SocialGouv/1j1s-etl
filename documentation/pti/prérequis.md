# Prérequis d'installation

## Introduction

Ce document relate les différents prérequis permettant l'installation du projet.

## Machine

Le projet a été développé pour fonctionner avec `Node.JS`  avec l'utilitaire `npm` pour lancer des commandes et gérer les dépendances.

Il faut donc que ces deux outils soient installés dans les versions suivantes : 

```json
"engines": {
    "node": "16.15.1",
    "npm": "8.11.0"
}
```

## Système

Notre projet a été développé et testé sur les produits cloud `Scalingo`. 

Pour lancer les tâches automatiquement nous avons ajouté le fichier `cron.json` à la racine du projet, conformément à la [documentation de Scalingo](https://doc.scalingo.com/platform/app/task-scheduling/scalingo-scheduler).
