| Questions                                                | Réponse de l'équipe                                                                                                               | Acté         | 
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|--------------|
| Langage de programmation                                 | TypeScript                                                                                                                        | X            |
| Nom du fichier d'entrée ? `start.ts`, `main.ts`, autre ? | `start.ts`                                                                                                                        | X            |
| Français vs Anglais dans le code ?                       | Français pour le métier et affichage, Anglais pour la tech                                                                        | X            | 
| Accents dans le code                                     | Non.                                                                                                                              | X            |
| Langue de documentation                                  | Français                                                                                                                          | X            |
| Langue dans les commits                                  | Français                                                                                                                          | X            |
| Convention de commits                                    | Inspiré de [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), voir ici                                       | X            |
| Stratégie pour les branches                              | Branche principale `main`                                                                                                         | X            |
| Nom des branches                                         | `<type de ticket>/<description>` (ex: `feat/ma-feature-fait-ca`)                                                                  | X            |
| Suppression des commits "wip"                            | Oui.                                                                                                                              | X            |
| Merge intermédiaire sur de gros tickets                  | S'organiser par dépôt/binôme (pas de consensus)                                                                                   | X            |
| Stratégie des code reviews                               | 1 à 2 approvals (idéalement), [conventional comments](https://conventionalcomments.org/)                                          | X            |
| Squash des commits                                       | Non mais rebase interactif pour garder un arbre clair                                                                             | X            |
| Contenu du message d'un commit                           | Un titre formaté, la description n'est pas obligatoire pour le moment (ex: `feat[transformation]: mise en place du client minio`) | X            |
| Gestion des versions + CHANGELOG                         | Librairie "semantic-release" mais sans jusqu'à la prod                                                                            | à rediscuter |
| CI/CD                                                    | GitHub Actions /!\ vérifier les droits                                                                                            | X            |
| Format Documentation                                     | Culture code, code auto-portant et tests                                                                                          | X            |
| Besoin exceptionnel de préciser un morceau de code       | Commentaire d'une ou deux lignes (nom des devs + date) + lien vers l'ADR si besoin                                                | X            |
| Documentation Prise de Décision Archi                    | ADR                                                                                                                               | X            |
| Style de programmation                                   | A rediscuter                                                                                                                      |              |
| Fonctions pures                                          | Oui, à confirmer pendant les développements                                                                                       | X            |
| Immutabilité des paramètres                              | Oui                                                                                                                               | X            |
| Nommage des fichiers                                     | kebab-case.\<type\>.ts                                                                                                            | X            |
| `async/await` vs `.then().catch()`                       | `async/await`                                                                                                                     | X            |
| Convention de code                                       | Convention Java                                                                                                                   | X            |
| Interface vs Type                                        | Interface à implémenter et Type pour un objet sans comportement                                                                   | X            |
| Stratégie de test                                        | Tests unitaires, tests de caractérisation pour les tests d'intégration, suivi du coverage (à chaque merge sur main)               | X            |
| Librairie(s) de test                                     | Mocha / Chai / Sinon                                                                                                              | X            |
| Express vs HapiJS                                        | A rediscuter lorsqu'on aura besoin d'exposer une API                                                                              | X            |
| Rétrospective tech avec tableau tech                     | Avoir au moins un tableau tech pour identifier la dette tech                                                                      | X            |
| Structure du dossier d'historisation                     | voir structure ci-dessous                                                                                                         | X            |
| Utilisation du Linter                                    | ESLint ?                                                                                                                          |              |
| Formatage                                                | Prettier ?                                                                                                                        |              |
| Axios ou Got                                             | Axios car CACH + SIBE ont une préférence, SEFR et DUMO s'alignent                                                                 | X            |
| Déclenchement des Crons Transform/Load                   | Schedules tasks avec une durée                                                                                                    |              |

# Questions à poser et à réfléchir en équipe

1. Express
2. HapiJS
3. Node sans quedale

A voir temps d'historisation
Structure du dossier d'historisation :
- Raw (bucket)
  - JobTeaser (folder)
    - history (folder)
    - latest.xml (file)
  - WTTJ
    - history
    - latest.json
- JSON
  - JobTeaser
    - history
    - latest.json
  - WTTJ
    - history
    - latest.json
- Result
  - JobTeaser
    - history
    - latest.json
  - WTTJ
    - history
    - latest.json
