# Resynchroniser les données Meilisearch avec celles de Strapi

## Contexte

Du fait de l'indexation document par document imposée par la stratégie d'insertion, modification et suppression d'une 
entrée dans une collection par Strapi, il peut arriver qu'une désynchronisation se produise entre Meilisearch et Strapi. 

## Qu'est-ce qui nous met la puce à l'oreille ?

En règle générale, nous nous apercevons de cette désynchronisation lorsque nous tentons d'accéder au détail d'une offre
de stage ou d'une annonce de logement et que l'interface utilisateur nous dit que nous n'avons pas trouvé l'offre ou
l'annonce.

## Que faire ?

1. Connectez-vous à l'application `Main CMS` de production, si vous ne savez pas où trouver les identifiants, demandez ;
2. Arrivé sur l'interface administrateur, vous trouverez un onglet `Meilisearch` sur le panneau de gauche, cliquez
dessus ;
3. Cherchez ensuite dans la liste des collections celle qui pose soucis ;
4. Si une désynchronisation est en effet d'actualité, vous devriez voir un différentiel entre le nombre de documents
présents en base de données et le nombre d'entrées de la collection dans la base de données de Strapi :

Exemple sans désynchronisation :

![ex sans désynchronisation](../assets/synchronisation-ok.png)

Exemple avec désynchronisation :

![ex avec désynchronisation](../assets/synchronisation-nok.png)

5. Vous voyez un bouton `Update`tout à droite de la ligne qui vous permet de purger les documents de ladite collection
sur Meilisearch et de les réindexer par batch, cliquez dessus une fois et soyez patient ;
6. Attendez un moment puis vérifiez si la désynchronisation a disparu.

## Si ça ne résout pas le problème ?

Vous pouvez investiguer davantage en manipulant directement l'
[API de Meilisearch](https://docs.meilisearch.com/reference/api/overview.html) pour voir si l'indexation est toujours
en cours ou non, voir si des documents ont bel et bien été envoyés à Meilisearch etc...

Essayez de durcir les méthodes liées à la transformation de vos données dans l'application `Main CMS` pour voir si cela
résout votre problème.
