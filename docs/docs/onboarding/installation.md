---
sidebar_position: 1000
---

# Lancer l'ETL

## Configuration

Il est nécéssaire de déclarer les variable d'environnement suivante :

```Environnemnent
#Variable d'application 
APPLICATION_LOGGER_NAME=main
APPLICATION_LOGGER_LOG_LEVEL=debug

#Dossier d'historisation des flux
HISTORY_DIRECTORY_NAME=history

#Variable lié au flux jobteaser
JOBTEASER_DIRECTORY_NAME=jobteaser
JOBTEASER_LOGGER_LOG_LEVEL=debug
JOBTEASER_NAME=jobteaser
JOBTEASER_RAW_FILE_EXTENSION=.xml
JOBTEASER_TRANSFORMED_FILE_EXTENSION=.json
JOBTEASER_RESULT_FILE_EXTENSION=.json

#Variable lié au flux StageFR compressé 
STAGEFR_COMPRESSED_DIRECTORY_NAME=stagefr-compresse
STAGEFR_COMPRESSED_LOGGER_LOG_LEVEL=debug
STAGEFR_COMPRESSED_NAME=stagefr-compresse
STAGEFR_COMPRESSED_RAW_FILE_EXTENSION=.xml
STAGEFR_COMPRESSED_TRANSFORMED_FILE_EXTENSION=.json

#Variable lié au flux StageFR décompressé 
STAGEFR_UNCOMPRESSED_DIRECTORY_NAME=stagefr-decompresse
STAGEFR_UNCOMPRESSED_LOGGER_LOG_LEVEL=debug
STAGEFR_UNCOMPRESSED_NAME=stagefr-decompresse
STAGEFR_UNCOMPRESSED_RAW_FILE_EXTENSION=.xml
STAGEFR_UNCOMPRESSED_TRANSFORMED_FILE_EXTENSION=.json

#Variable lié à minio
MINIO_ACCESS_KEY=
MINIO_PORT=443
MINIO_RAW_BUCKET_NAME=stages-raw
MINIO_RESULT_BUCKET_NAME=stages-result
MINIO_SECRET_KEY=
MINIO_TRANSFORMED_BUCKET_NAME=stages-json
MINIO_URL=
MINIO_USE_SSL=true

#Variable lié au api strapi
STRAPI_AUTHENTICATION_URL=
STRAPI_BASE_URL=
STRAPI_OFFRE_DE_STAGE_URL=
STRAPI_PASSWORD=
STRAPI_USERNAME=john.cena@example.com

#Dossier local temporaire
TEMPORARY_DIRECTORY_PATH=/tmp
```

## Manuellement

Une fois chaque variable déclarée, lancer la commande suivante :

```bash
npm ci
```

Cette dernière installera l'ensemble des dépendances nécessaire au bon lancement du projet.

Vous pouvez alors compiler l'application grâce à la commande suivante :

```bash
npm run build
```

## En automatique sur Scalingo

Les déploiements se font grâce à la procédure suivante :
