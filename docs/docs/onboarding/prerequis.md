---
sidebar_label: Prérequis d'installation
sidebar_position: 1
---

# Prérequis d'installation

_20 Avril 2023_

## Introduction

Ce document relate les différents prérequis permettant l'installation du projet.

## Machine

Le projet a été développé pour fonctionner avec `Node.JS`  avec l'utilitaire `npm` pour lancer des commandes et gérer les dépendances.

Il faut donc que ces deux outils soient installés dans les versions suivantes : 

```json
"engines": {
    "node": "18.14.0",
    "npm": "9.3.1"
}
```

## Système

Notre projet a été développé et testé sur les produits cloud `Scalingo`. 

Pour lancer les tâches automatiquement nous avons ajouté le fichier `cron.json` à la racine du projet, conformément à la [documentation de Scalingo](https://doc.scalingo.com/platform/app/task-scheduling/scalingo-scheduler).
