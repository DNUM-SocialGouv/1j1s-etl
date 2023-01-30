# Conventions Git

## Commit

### Convention

Nous allons nous baser sur la convention "[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)" que
nous allons légèrement modifié pour nos usages. Voir document [ci-joint](docs/conventions/convention-commit.mdon-commit.md).

### Langue

Il a été convenu de rédiger les commits en français car le projet n'est pas à destination internationale.
Celui-ci est destiné en premier lieu au gouvernement français.

### Contextes d'un commit

La liste des contextes suivants ont été identifiés pour ce dépôt :

+ `architecture` - pour toute modification de l'architecture du projet
+ `cli` - pour toute modification de la CLI
+ `configuration` - pour toute modification de configuration, incluant la configuration des modules
+ `dependencies` - pour toute modification ayant trait aux dépendances du projet
+ `evenements` - pour toute modification ayant trait aux événements
+ `logements` - pour toute modification ayant trait aux annonces de logements
+ `multiple` - pour toute modification ayant trait à 2 ou plusieurs contextes
+ `stages` - pour toute modification ayant trait aux offres de stages

### Contenu du message

Un message de commit doit contenir a minima un titre court formaté contenant un préfixe cité dans la convention
ci-dessus. Si une description supplémentaire est nécessaire, celle-ci sera ajoutée dans un sous-message de commit.

```shell
$ git commit -m "feat(transformation): mise en place du client minio" -m "Une description un peu plus détaillée..."
```

## Stratégie pour les branches

### Branche principale

Nous avons décidé que nous aurons une seule branche de déploiement `main` sur tous les dépôts liés aux stages. Puis nous
ouvrirons des branches pour chacune de nos fonctionnalités que nous mergerons en finalité sur la branche `main` une fois
toutes les étapes du flux franchies. 

### Autres branches

Nous avons opté pour la convention suivante concernant le nom des branches :

`<type de ticket>/<description>`

Les types de ticket possibles sont les suivants :

| Préfixe   | Type de ticket  | Définition                                                         | 
|-----------|-----------------|--------------------------------------------------------------------|
| `feat`    | Fonctionnalité  | Une nouvelle fonctionnalité métier ajoutée à l'application         |
| `evol`    | Evolution       | Une évolution d'une fonctionnalité existante métier                |
| `fix`     | Correction      | Correction d'un bug identifié                                      |
| `tech`    | Technique       | Une nouvelle fonctionnalité technique pour améliorer l'application |
| `refacto` | Technique       | Une refonte technique pour améliorer l'application                 |
| `doc`     | Documentation   | Ajouter ou modifier de la documentation                            |

## Commits de "Work In Progress"

Afin de préserver un arbre des commits propres, il sera nécessaire de supprimer les commits dits "wip" à l'aide la
fonction `rebase` proposée par Git.

Exemple qui permet de réecrire l'arbre des 4 derniers commits :

```shell
$ git rebase -i head~4
```

Si votre dernier commit est un "wip" que vous avez remis au propre, vous pouvez simplement l'amend comme ci-dessous :

```shell
$ git commit --amend
```

⚠️ Nous ne squasherons pas nos commits lors du merge d'une branche dans la branche `main`.

## Stratégie de merge

### Code Review

Nous allons nous baser sur la convention "[Conventional Comments](https://conventionalcomments.org/)" que
nous allons légèrement modifié pour nos usages. Voir document [ci-joint](docs/conventions/convention-comment.mdn-comment.md).

Chaque Pull Request (PR) devra être approuvée a minima par une personne n'ayant pas travaillé sur le ticket en rapport
avec la PR.

### Pull request intermédiaire sur de gros tickets

S'organiser par dépôt/binôme.

---

⚓️ [Retour au sommaire](../index.md)
