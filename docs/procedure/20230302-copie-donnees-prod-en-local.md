# Copie des données de prod en local

---

## Prérequis

Afin de pouvoir exécuter la procédure qui suit, 
vous devez avoir en votre possession une clef vous permettant à vous connecter sur la production du projet.

Afin de manipuler les conteneurs et applications sur scalingo il vous faudra installer leur 
[CLI](https://doc.scalingo.com/platform/cli/start#install-scalingo-cli)

Vous pouvez exécuter la commande suivante pour installer ou mettre à jour `Scalingo CLI`:

```/bin/bash
$ curl -O https://cli-dl.scalingo.com/install && bash install
```

## Procédure

### Variable d'environnement utile

```/bin/bash
$ export SCALINGO_APP='1j1s-main-cms'
$ export SCALINGO_REGION='osc-fr1'
$ export ADDON_NAME='postgresql'
$ export API_TOKEN='<la clef de prod>'
```

### Connexion

Dans un premier temps il vous faudra vous connecter à l'aide de votre clef

```/bin/bash
$ scalingo login --api-token ${API_TOKEN}
```

### Téléchargement de la Backup

Pour télécharger la dernière backup de la BDD en Production, il faut lancer
les commandes suivantes :

```/bin/bash
$ addon_id=$(scalingo addons | grep $ADDON_NAME | cut -d'|' -f3 | tr -d ' ')
$ mkdir -p tmp
$ scalingo --addon ${addon_id} backups-download --output tmp/backup.zip
```

### Monter la backup en local


Une fois le téléchargement terminé, 
il suffit de démarrer la BDD présente sur votre poste en lui chargeant le fichier.

```/bin/bash
$ docker-compose cp ./tmp/backup.zip db:/backups/backup.dump
$ docker-compose exec db pg_restore -U $DATABASE_USERNAME -d $DATABASE_NAME /backups/backup.dump
```


