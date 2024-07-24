---
sidebar_label: Que faire Lorsque le flux ne se mets plus à jour ?
sidebar_position: 5
---

# Lorsque le flux ne se mets plus à jour

_20 Avril 2023 (mis à jour le 24 Juillet 2024)_

:::info Contexte
Le flux ne se met plus à jour sur Strapi ou plusieurs offres sont toujours disponibles pour le flux mais ces dernières sont peut être obsolètes.
:::


## Analyse de l’erreur
Vérifier si les tâches crons fonctionnent : 
- Sur les buckets de Minio les fichiers latest ne sont plus à la date du jour
- Sur les buckets de Minio, le répertoire history ou les fichiers historiques présents dans ce répertoire ne sont plus à la date du jour ou sont supprimés.  (NB : un fichier vide fait 2b) 

### Origine possible de l’erreur
- La taille du flux est devenue trop grande pour le container
- Une erreur apparaît dans un des cron

## Que faire
- Dans un premier temps, trouver quel cron ne parvient plus à assurer les mises à jour du flux.
- Dans un second temps, repérer l’origine de l’erreur.
  - Si c’est une erreur, analyser et corriger le bogue.
  - Si c’est la taille du flux qui pose problème, augmenter la taille du container dans le fichier cron.json. (voir les valeurs de mémoire associées au pricing sur https://scalingo.com/fr/pricing)
	  - S = 250 mo
	  - M = 512 mo
	  - L = 1 Go
	  - XL = 2 Go
	  - 2XL = 4 Go
