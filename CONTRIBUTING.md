# Nos conventions

## Sommaire

* [Langage de programmation](./documentation/conventions/langage-de-programmation.md)
* [Git](./documentation/conventions/git.md)

| Done | Questions                                                | Réponse de l'équipe                                                                                                               | Acté         |  
|------|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|--------------|
| X    | Langage de programmation                                 | TypeScript                                                                                                                        | X            |
| X    | Nom du fichier d'entrée ? `start.ts`, `main.ts`, autre ? | `start.ts`                                                                                                                        | X            |
| X    | Français vs Anglais dans le code ?                       | Français pour le métier et affichage, Anglais pour la tech                                                                        | X            | 
| X    | Accents dans le code                                     | Non.                                                                                                                              | X            |
| X    | Langue de documentation                                  | Français                                                                                                                          | X            |
| X    | Langue dans les commits                                  | Français                                                                                                                          | X            |
| X    | Convention de commits                                    | Inspiré de [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), voir ici                                       | X            |
| X    | Stratégie pour les branches                              | Branche principale `main`                                                                                                         | X            |
| X    | Nom des branches                                         | `<type de ticket>/<description>` (ex: `feat/ma-feature-fait-ca`)                                                                  | X            |
| X    | Suppression des commits "wip"                            | Oui.                                                                                                                              | X            |
| X    | Merge intermédiaire sur de gros tickets                  | S'organiser par dépôt/binôme (pas de consensus)                                                                                   | X            |
| X    | Stratégie des code reviews                               | 1 à 2 approvals (idéalement), [conventional comments](https://conventionalcomments.org/)                                          | X            |
| X    | Squash des commits                                       | Non mais rebase interactif pour garder un arbre clair                                                                             | X            |
| X    | Contenu du message d'un commit                           | Un titre formaté, la description n'est pas obligatoire pour le moment (ex: `feat[transformation]: mise en place du client minio`) | X            |
|      | Gestion des versions + CHANGELOG                         | Librairie "semantic-release" mais sans jusqu'à la prod                                                                            | à rediscuter |
| X    | CI/CD                                                    | GitHub Actions /!\ vérifier les droits                                                                                            | X            |
| X    | Format Documentation                                     | Culture code, code auto-portant et tests                                                                                          | X            |
| X    | Besoin exceptionnel de préciser un morceau de code       | Commentaire d'une ou deux lignes (nom des devs + date) + lien vers l'ADR si besoin                                                | X            |
| X    | Documentation Prise de Décision Archi                    | ADR                                                                                                                               | X            |
| X    | Style de programmation                                   | Programmation Orientée Objet                                                                                                      | X            |
| X    | Fonctions pures                                          | Oui, à confirmer pendant les développements                                                                                       | X            |
| X    | Nommage des fichiers                                     | kebab-case.\<type\>.ts                                                                                                            | X            |
| X    | `async/await` vs `.then().catch()`                       | `async/await`                                                                                                                     | X            |
| X    | Convention de code                                       | Convention Java                                                                                                                   | X            |
| X    | Interface vs Type                                        | Interface à implémenter et Type pour un objet sans comportement                                                                   | X            |
| X    | Stratégie de test                                        | Tests unitaires, tests de caractérisation pour les tests d'intégration, suivi du coverage (à chaque merge sur main)               | X            |
| X    | Librairie(s) de test                                     | Mocha / Chai / Sinon                                                                                                              | X            |
| X    | Express vs HapiJS                                        | A rediscuter lorsqu'on aura besoin d'exposer une API                                                                              | X            |
| X    | Rétrospective tech avec tableau tech                     | Avoir au moins un tableau tech pour identifier la dette tech                                                                      | X            |
| X    | Structure du dossier d'historisation                     | Voir structure ci-dessous                                                                                                         | X            |
| X    | Utilisation du Linter                                    | ESLint                                                                                                                            | X            |
| X    | Axios ou Got                                             | Axios car CACH + SIBE ont une préférence, SEFR et DUMO s'alignent                                                                 | X            |
| X    | Déclenchement des crons Extract/Transform/Load           | Schedules tasks avec une durée pour tenir au 18/10                                                                                | X            |
| X    | Single Quote vs Double vs Backtick                       | Double Quote par défaut, Backticks quand on en a besoin                                                                           | X            |
| X    | Point virgule ou pas ?                                   | On met les points virgules en fin d'instruction                                                                                   | X            |
| X    | Indentation ?                                            | 1 Tabulation                                                                                                                      | X            |
| X    | `if` à une seule instruction                             | On met des brackets                                                                                                               | X            |
| X    | Complexité cyclomatique maximale                         | 10                                                                                                                                | X            |
| X    | Complexité cognitive maximale                            | 2                                                                                                                                 | X            |
| X    | Pas de `any`                                             | Pas de `any` sauf absolument nécessaire                                                                                           | X            |
| X    | Pas de `ts-ignore`                                       | Pas de `ts-ignore`                                                                                                                | X            |
|      | Commit Hook ESLint (vomit @SEFR)                         | Oui                                                                                                                               | X            |
|      | Push Hook TU                                             | Oui                                                                                                                               | X            |
|      | Issue tracking                                           | A définir si publié                                                                                                               |              |
|      | Portée explicite devant les méthodes et les attributs    |                                                                                                                                   |              |
| X    | `var` vs `const`, `let`                                  | `const` et `let`                                                                                                                  | X            |
| X    | Citer ses sources                                        |                                                                                                                                   |              | 
