---
sidebar_label: Comment créer un nouveau bucket sur Minio
sidebar_position: 4
---

# Comment créer un nouveau bucket sur Minio

_01 Août 2023 (mis à jour le 24 Juillet 2024)_

:::info Contexte
Lors de la création d'une nouvelle étape d'Extract / Transform / Load, il faut créer les buckets correspondants sur Minio qui accueilleront les fichiers correspondants.
:::


## Cas d'usage

Exemple pour les différentes étapes d'ETL des annonces de logements, je dois créer les buckets suivants : 
```
HOUSING_MINIO_RAW_BUCKET_NAME=housing-raw
HOUSING_MINIO_TRANSFORMED_BUCKET_NAME =housing-json
HOUSING_MINIO_RESULT_BUCKET_NAME=housing-result
HOUSING_MINIO_TRANSFORMED_BUCKET_NAME=housing-transform-bucket
HOUSING_MINIO_RESULT_BUCKET_NAME=housing-result-bucket
```

## La commande
Pour cela, une fois l'application déployée, on lance la commande sous le modèle suivant via l'outil CLI scalingo : 

```shell
scalingo --region osc-fr1 --app [NOM_APPLICATION_SCALINGO] run "npm run cli -- mkbucket -b [BUCKET_NAME]"
```

### Exemple
Exemple en _recette_ pour la création de `HOUSING_MINIO_RAW_BUCKET_NAME` qui vaut `housing-raw`:
```shell
scalingo --region osc-fr1 --app 1j1s-stage-orchestrateur-transform-load run "npm run cli -- mkbucket -b housing-raw"
```

### En local

En local, on peut utiliser la commande suivante en s'assurant d'être branché sur le bon environnement :

```shell
npm run dev:cli -- mkbucket -b [BUCKET_NAME]
```

