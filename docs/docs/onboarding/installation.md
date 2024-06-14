---
sidebar_label: Lancer l'ETL
sidebar_position: 2
---

# Lancer l'ETL

_20 Avril 2023_

## Configuration

Il est nécéssaire de déclarer les variable d'environnement suivante :

```Environnemnent
#Variable d'application 
APPLICATION_LOGGER_NAME=main
APPLICATION_LOGGER_LOG_LEVEL=debug

#Dossier d'historisation des flux
HISTORY_DIRECTORY_NAME=history

#Variable lié à minio
MINIO_ACCESS_KEY=
MINIO_PORT=443
MINIO_RESULT_BUCKET_NAME=stages-result
MINIO_SECRET_KEY=
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
