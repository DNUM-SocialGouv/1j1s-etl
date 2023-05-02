---
sidebar_label: Minio, comment ça marche ?
sidebar_position: 3
---

# Comment consulter le contenu du dépôt MinIO

_20 Avril 2023_

Nous utilisons l'interface `Amazon Web Services Command Line Interface (CLI)` afin de pouvoir consulter
le contenu du dépôt de fichier MinIO que nous utilisons sur le projet.

## Installation

En fonction de votre environnement, vous devrez utiliser des manières différentes pour installer 
l'`AWS CLI`.

### macOS

<details>
<summary>Voir la procédure</summary>

1. Lancez la commande ci-dessous :

```shell
$ brew install awscli
```
</details>

### Linux

<details>
<summary>Voir la procédure</summary>

1. Lancez la commande ci-dessous :

```shell
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```
</details>

### Vérifier l'installation

2. Vérifiez si la CLI s'est correctement installée avec la commande suivante :

```shell
$ aws --version
```

Résultat attendu :

```shell
aws-cli/<version> Python/<version> Darwin/<version> source/<nombre de bits> prompt/<on/off>
```

## Configuration

Pour pouvoir vous connecter au dépôt MinIO, vous allez devoir configurer votre CLI et en particulier 
les `credentials`, nous y reviendrons dans un moment. Pour démarrer la configuration, il vous suffit 
de lancer la commande :

```shell
$ aws configure
```

```shell
AWS Access Key ID [None]: <contactez un membre de la team pour cette valeur>
AWS Secret Access Key [None]: <contactez un membre de la team pour cette valeur>
Default region name [None]: None
Default output format [None]: json
```

And voilà !

## Consulter les fichiers sur le dépôt

Afin de pouvoir consulter de manière digeste les différents fichiers qui sont sur le dépôt distant,
utilisez la commande suivante :

```shell
$ aws --endpoint-url <url aws> s3 ls s3://<nom_du_bucket>/path/to/folder --recursive --human-readable --summarize
```

```shell
2022-07-23 07:00:00   51.4 MiB path/to/folder/history/2022-07-23T05:00:03.424Z.xml
2022-07-24 07:00:00   48.8 MiB path/to/folder/history/2022-07-24T05:00:01.775Z.xml
2022-07-25 07:00:00   48.5 MiB path/to/folder/history/2022-07-25T05:00:01.460Z.xml
2022-07-25 07:00:00   48.5 MiB path/to/folder/latest.xml

Total Objects: 4
   Total Size: 197.2 MiB
```

Que faisons-nous ci-dessus ?

* `--endpoint-url` nous permet de spécifier l'URL du cloud AWS auquel nous cherchons à nous connecter.
* `s3` signifie que nous nous connectons à un Object Cloud Storage S3 et utilise le `bin` s3 présent
dans la CLI AWS.
* `ls` permet de lister les fichiers présents dans un dossier (commande Unix).
* `--recursive` permet d'afficher le contenu des sous-dossiers s'il y en a.
* `--human-readable` permet d'afficher la sortie pour que ce soit compréhensible par l'humain.
* `--summarize` affiche des informations élémentaires (nombre d'objets, taille totale...).
