# Nos conventions

## Sommaire

* [Langage de programmation](docs/conventions/langage-de-programmation.md)
* [Git](docs/conventions/git.md)

| Questions                                                | Réponse de l'équipe                                                                                                               | Acté |  
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|------|
| Langage de programmation                                 | TypeScript                                                                                                                        | X    |
| Nom du fichier d'entrée ? `start.ts`, `main.ts`, autre ? | `start.ts`                                                                                                                        | X    |
| Français vs Anglais dans le code ?                       | Français pour le métier et affichage, Anglais pour la tech                                                                        | X    | 
| Accents dans le code                                     | Non.                                                                                                                              | X    |
| Langue de documentation                                  | Français                                                                                                                          | X    |
| Langue dans les commits                                  | Français                                                                                                                          | X    |
| Convention de commits                                    | Inspiré de [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), voir ici                                       | X    |
| Stratégie pour les branches                              | Branche principale `main`                                                                                                         | X    |
| Nom des branches                                         | `<type de ticket>/<description>` (ex: `feat/ma-feature-fait-ca`)                                                                  | X    |
| Suppression des commits "wip"                            | Oui.                                                                                                                              | X    |
| Merge intermédiaire sur de gros tickets                  | S'organiser par dépôt/binôme (pas de consensus)                                                                                   | X    |
| Stratégie des code reviews                               | 1 à 2 approvals (idéalement), [conventional comments](https://conventionalcomments.org/)                                          | X    |
| Squash des commits                                       | Non mais rebase interactif pour garder un arbre clair                                                                             | X    |
| Contenu du message d'un commit                           | Un titre formaté, la description n'est pas obligatoire pour le moment (ex: `feat[transformation]: mise en place du client minio`) | X    |
| Gestion des versions + CHANGELOG                         | Librairie `release-please`                                                                                                        | X    |
| CI/CD                                                    | GitHub Actions                                                                                                                    | X    |
| Format Documentation                                     | Culture code, code auto-portant et tests                                                                                          | X    |
| Besoin exceptionnel de préciser un morceau de code       | Commentaire d'une ou deux lignes (nom des devs + date) + lien vers l'ADR si besoin                                                | X    |
| Documentation Prise de Décision Archi                    | ADR                                                                                                                               | X    |
| Style de programmation                                   | Programmation Orientée Objet                                                                                                      | X    |
| Fonctions pures                                          | Oui, à confirmer pendant les développements                                                                                       | X    |
| Nommage des fichiers                                     | kebab-case.\<type\>.ts                                                                                                            | X    |
| `async/await` vs `.then().catch()`                       | `async/await`                                                                                                                     | X    |
| Convention de code                                       | Convention Java                                                                                                                   | X    |
| Interface vs Type                                        | Interface à implémenter et Type pour un objet sans comportement                                                                   | X    |
| Stratégie de test                                        | Tests unitaires, tests de caractérisation pour les tests d'intégration, suivi du coverage (à chaque merge sur main)               | X    |
| Librairie(s) de test                                     | Mocha / Chai / Sinon                                                                                                              | X    |
| Express vs HapiJS                                        | A rediscuter lorsqu'on aura besoin d'exposer une API                                                                              | X    |
| Rétrospective tech avec tableau tech                     | Avoir au moins un tableau tech pour identifier la dette tech                                                                      | X    |
| Structure du dossier d'historisation                     | Voir structure ci-dessous                                                                                                         | X    |
| Utilisation du Linter                                    | ESLint                                                                                                                            | X    |
| Axios ou Got                                             | Axios car CACH + SIBE ont une préférence, SEFR et DUMO s'alignent                                                                 | X    |
| Déclenchement des crons Extract/Transform/Load           | Schedules tasks avec une durée pour tenir au 18/10                                                                                | X    |
| Single Quote vs Double vs Backtick                       | Double Quote par défaut, Backticks quand on en a besoin                                                                           | X    |
| Point virgule ou pas ?                                   | On met les points virgules en fin d'instruction                                                                                   | X    |
| Indentation ?                                            | 1 Tabulation                                                                                                                      | X    |
| `if` à une seule instruction                             | On met des brackets                                                                                                               | X    |
| Complexité cyclomatique maximale                         | 10                                                                                                                                | X    |
| Complexité cognitive maximale                            | 2                                                                                                                                 | X    |
| Pas de `any`                                             | Pas de `any` sauf absolument nécessaire                                                                                           | X    |
| Pas de `ts-ignore`                                       | Pas de `ts-ignore`                                                                                                                | X    |
| Commit Hook ESLint (vomit @SEFR)                         | Non                                                                                                                               | X    |
| Issue tracking via le board Silver Team                  | A définir si publié                                                                                                               | X    |
| Portée explicite devant les méthodes et les attributs    | Oui                                                                                                                               | X    |
| `var` vs `const`, `let`                                  | `const` et `let`                                                                                                                  | X    |
| Citer ses sources                                        | Citer ses sources dans la documentation                                                                                           | X    | 
