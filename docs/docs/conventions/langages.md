# Langages

## Choix du langage

Nous avons choisi de partir sur du `TypeScript` sur une plateforme `NodeJS`. Ce choix s'explique par
la compétence de l'équipe sur la technologie et le fait que nous n'avons pas d'enjeux de performances
particuliers à date.

## Principes généraux

### Paradigme

Nous avons choisi de développer l'application en programmation orientée objet afin d'augmenter la
lisibilité du code et d'en adopter ses principes.

_Exemple_ :
```typescript
class MaClasse {
    public doSomething(): Promise<void> {
        // do something ...
    }
}
```

### Portée des méthodes et des attributs

Nous avons décidé que les portées des méthodes et des attributs seront [to be continued...]

### Fonctions pures

Dans la même veine, nous avons décidé que nos fonctions devaient être des fonctions pures. C'est-à-dire qu'une fonction
ne doit pas modifier ses paramètres d'entrées et doit être idempotente.

_Exemple_ :
```typescript
class Calculette {
    public additionner(a: number, b: number): number {
        return a + b;
    }
}
```

## Style de code

Nous avons choisi d'utiliser [ESLint](https://eslint.org/) pour appliquer des règles concernant notre style de code.
Vous trouverez ci-dessous une liste non-exhaustive de règles à appliquer dans nos dépôts.

### Utilisation des ternaires

Nous limitons l'utilisation des conditions ternaires lorsque la condition est très simple.

_Exemple_ :
```typescript
isTrue(false)
    ? true
    : false;
```

L'utilisation des niveaux supplémentaires est proscrite.

### `if` à une seule instruction

Nous avons décidé qu'un `if` suivi d'une seule instruction devait quand même être wrappé dans des accolades.

```typescript
// Valide
if (true) {
    return false;
}

// Invalide
if (true) 
    return false;
```

### `async / await` vs `.then().catch()`

Nous avons décidé d'utiliser la version d'ES2015 pour gérer nos `Promise` afin d'améliorer la lisibilité du code.

_Exemple_ :
```typescript
function toto(): Promise<string> {
	return new Promise((resolve) => {
		resolve('toto');
    });
}

// Valide
async function modern(): Promise<string> {
	const tata = await toto();
	return tata + "tata";
}

// Invalide
async function deprecated(): Promise<string> {
	const tata = toto()
        .then((value) => value)
        .catch((e) => {/* ... */})
}
```

### Interface vs Type

Nous avons choisi d'utiliser des interfaces pour définir un contrat à implémenter et des types si nous devons définir
des structures de données qui n'ont pas de comportement.

```typescript
// Valide
export type Personne = {
	nom: string;
	prenom: string;
	age: number;
}

// Invalide
export interface Personne {
	nom: string;
	prenom: string;
	age: number;
}

// Valide
export interface Contrat {
    doSomething(a: number, b: string): void;
}

// Invalide
export type Contrat = {
	doSomething: (a: number, b: string) => void;
}
```

### Délimitation d'une instruction

Chaque ligne d'instruction devra se terminer par un point-virgule `;`.

```typescript
// Valide
const toto = 'toto';

// Invalide
const toto = 'toto'
```

### Déclaration des variables

Nous avons décidé de déclarer les variables avec des `const` et `let`.
L'utilisation de `var` est proscrite.

### Guillemets

Nous avons décidé d'utiliser des guillemets (_double quote_) et guillemets obliques (_backtick_) dans le code.

### Espace vs Tabulation pour l'indentation

Nous avons choisi d'utiliser le caractère tabulation plutôt que les caractères d'espace pour notre indentation.

### Convention de code

Nous avons décidé d'utiliser la convention Java dans le code car elle est très répandue et que nous sommes alignés avec
cette convention ([ici](https://www.oracle.com/technetwork/java/codeconventions-150003.pdf)). De plus, elle est
compatible avec notre choix de linter.

### Nommage des fichiers

Nous avons décidé d'adopter la convention **kebab-case** pour nommer nos fichiers. De plus, nous avons décidé d'ajouter
un suffixe pour définir la nature de ce qui se trouve à l'intérieur.

_Exemple_ : 
```
Valide : minio-storage.client.ts

Invalide : MinioStorageClient.ts
```

### Typage dynamique

Nous avons décidé de ne pas utiliser le type `any` sauf en cas d'absolue nécessité.

### Ts-ignore

Nous avons décidé de ne pas utiliser l'annotation `ts-ignore`.

### Commentaires

Nous avons décidé d'écrire du code auto-portant et de n'utiliser les commentaires qu'en cas de nécessité et se limitant à 1 à 2 lignes. 

## Complexités

### Cyclomatique

Nous avons fixé la limite maximale de complexité cyclomatique à **10** afin de conserver des fonctions simples, améliorer la
lisibilité et la maintenance du code.

### Cognitive

Nous avons fixé la limite maximale de complexité cognitive à **2** afin de conserver des fonctions lisibles et de nous
forcer à extraire la complexité dans des sous-fonctions.
