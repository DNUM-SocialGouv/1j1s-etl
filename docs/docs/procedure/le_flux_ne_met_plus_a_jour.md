# Lorsque le flux ne se mets plus à jour

## Détail de l'erreur

Le flux ne se mets plus à jour sur strapi. Plusieurs offres sont toujours disponible pour le flux mais ces dernières sont peut être obselète.

## Analyse de l'erreur

Sur les bucket de minio les fichiers latest ou les fichier ne sont plus à la date du jours. Dans ce cas un des crons ne fonctionne plus.

### Origine possible de l'erreur

 - La taille du flux est devenu trop grande pour le container
 - Une erreur apparaît dans un des cron

## Que faire

Dans un premier temps, trouver quel cron ne parviens plus à assurer les mises à jours du flux.

Dans un seconds temps, Repèrer l'origine de l'erreur.
  - Si c'est une erreur, analyser et corriger le bogue.
  - Si c'est la taille du flux qui pose problème, augmenter la taille du container dans le fichier cron.json
