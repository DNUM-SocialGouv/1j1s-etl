# 1j1s-orchestrateur-transform-load

Dépôt qui regroupe les opérations de transformation et de chargement des données issues de flux pour les stages du site 1j1s

## Installer

Pour construire l'application il faut lancer les commandes pour synchroniser votre poste

```bash
npm ci
```

Puis il faut contruire le programme cible

```bash
npm run build
```

## Lancer un job

Pour lancer un job il faut mettre les bons arguments dans la commande de lancement

```bash
npm run cli -- -a {action} -f {nom du flux}
```

Liste des jobs disponibles : 

| nom du flux\action | transform | load |
| :----------------- | :-------: | :--: |
| jobteaser          |     X     |  X   |
| stagefr-compresse  |     X     |  X   |
| stagefr-decompresse|     X     |  X   |
