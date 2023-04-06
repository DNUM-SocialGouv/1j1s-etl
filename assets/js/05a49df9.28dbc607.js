"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[160],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>k});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(n),m=r,k=c["".concat(s,".").concat(m)]||c[m]||d[m]||i;return n?a.createElement(k,o(o({ref:t},p),{},{components:n})):a.createElement(k,o({ref:t},p))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:r,o[1]=l;for(var u=2;u<i;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7182:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var a=n(7462),r=(n(7294),n(3905));const i={},o="Git",l={unversionedId:"conventions/git",id:"conventions/git",title:"Git",description:"Commit",source:"@site/docs/conventions/git.md",sourceDirName:"conventions",slug:"/conventions/git",permalink:"/1j1s-etl/docs/conventions/git",draft:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/conventions/git.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\ud83d\uded2 Conventions",permalink:"/1j1s-etl/docs/category/-conventions"},next:{title:"Langages",permalink:"/1j1s-etl/docs/conventions/langages"}},s={},u=[{value:"Commit",id:"commit",level:2},{value:"Convention",id:"convention",level:3},{value:"Langue",id:"langue",level:3},{value:"Contextes d&#39;un commit",id:"contextes-dun-commit",level:3},{value:"Contenu du message",id:"contenu-du-message",level:3},{value:"Strat\xe9gie pour les branches",id:"strat\xe9gie-pour-les-branches",level:2},{value:"Branche principale",id:"branche-principale",level:3},{value:"Autres branches",id:"autres-branches",level:3},{value:"Commits de &quot;Work In Progress&quot;",id:"commits-de-work-in-progress",level:2},{value:"Strat\xe9gie de merge",id:"strat\xe9gie-de-merge",level:2},{value:"Code Review",id:"code-review",level:3},{value:"Pull request interm\xe9diaire sur de gros tickets",id:"pull-request-interm\xe9diaire-sur-de-gros-tickets",level:3}],p={toc:u},c="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"git"},"Git"),(0,r.kt)("h2",{id:"commit"},"Commit"),(0,r.kt)("h3",{id:"convention"},"Convention"),(0,r.kt)("p",null,'Nous allons nous baser sur la convention "',(0,r.kt)("a",{parentName:"p",href:"https://www.conventionalcommits.org/en/v1.0.0/"},"Conventional Commits"),'".'),(0,r.kt)("h3",{id:"langue"},"Langue"),(0,r.kt)("p",null,"Il a \xe9t\xe9 convenu de r\xe9diger les commits en fran\xe7ais car le projet n'est pas \xe0 destination internationale.\nCelui-ci est destin\xe9 en premier lieu au gouvernement fran\xe7ais."),(0,r.kt)("h3",{id:"contextes-dun-commit"},"Contextes d'un commit"),(0,r.kt)("p",null,"La liste des contextes suivants ont \xe9t\xe9 identifi\xe9s pour ce d\xe9p\xf4t :"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"architecture")," - pour toute modification de l'architecture du projet"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"cli")," - pour toute modification de la CLI"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"configuration")," - pour toute modification de configuration, incluant la configuration des modules"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"dependencies")," - pour toute modification ayant trait aux d\xe9pendances du projet"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"evenements")," - pour toute modification ayant trait aux \xe9v\xe9nements"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"logements")," - pour toute modification ayant trait aux annonces de logements"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"multiple")," - pour toute modification ayant trait \xe0 2 ou plusieurs contextes"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"stages")," - pour toute modification ayant trait aux offres de stages")),(0,r.kt)("h3",{id:"contenu-du-message"},"Contenu du message"),(0,r.kt)("p",null,"Un message de commit doit contenir a minima un titre court format\xe9 contenant un pr\xe9fixe cit\xe9 dans la convention\nci-dessus. Si une description suppl\xe9mentaire est n\xe9cessaire, celle-ci sera ajout\xe9e dans un sous-message de commit."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'$ git commit -m "feat(transformation): mise en place du client minio" -m "Une description un peu plus d\xe9taill\xe9e..."\n')),(0,r.kt)("h2",{id:"strat\xe9gie-pour-les-branches"},"Strat\xe9gie pour les branches"),(0,r.kt)("h3",{id:"branche-principale"},"Branche principale"),(0,r.kt)("p",null,"Nous avons d\xe9cid\xe9 que nous aurons une seule branche de d\xe9ploiement ",(0,r.kt)("inlineCode",{parentName:"p"},"main")," sur tous les d\xe9p\xf4ts li\xe9s aux stages. Puis nous\nouvrirons des branches pour chacune de nos fonctionnalit\xe9s que nous mergerons en finalit\xe9 sur la branche ",(0,r.kt)("inlineCode",{parentName:"p"},"main")," une fois\ntoutes les \xe9tapes du flux franchies. "),(0,r.kt)("h3",{id:"autres-branches"},"Autres branches"),(0,r.kt)("p",null,"Nous avons opt\xe9 pour la convention suivante concernant le nom des branches :"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"<type de ticket>/<description>")),(0,r.kt)("p",null,"Les types de ticket possibles sont les suivants :"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Pr\xe9fixe"),(0,r.kt)("th",{parentName:"tr",align:null},"Type de ticket"),(0,r.kt)("th",{parentName:"tr",align:null},"D\xe9finition"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"feat")),(0,r.kt)("td",{parentName:"tr",align:null},"Fonctionnalit\xe9"),(0,r.kt)("td",{parentName:"tr",align:null},"Une nouvelle fonctionnalit\xe9 m\xe9tier ajout\xe9e \xe0 l'application")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"evol")),(0,r.kt)("td",{parentName:"tr",align:null},"Evolution"),(0,r.kt)("td",{parentName:"tr",align:null},"Une \xe9volution d'une fonctionnalit\xe9 existante m\xe9tier")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"fix")),(0,r.kt)("td",{parentName:"tr",align:null},"Correction"),(0,r.kt)("td",{parentName:"tr",align:null},"Correction d'un bug identifi\xe9")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"tech")),(0,r.kt)("td",{parentName:"tr",align:null},"Technique"),(0,r.kt)("td",{parentName:"tr",align:null},"Une nouvelle fonctionnalit\xe9 technique pour am\xe9liorer l'application")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"refacto")),(0,r.kt)("td",{parentName:"tr",align:null},"Technique"),(0,r.kt)("td",{parentName:"tr",align:null},"Une refonte technique pour am\xe9liorer l'application")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"doc")),(0,r.kt)("td",{parentName:"tr",align:null},"Documentation"),(0,r.kt)("td",{parentName:"tr",align:null},"Ajouter ou modifier de la documentation")))),(0,r.kt)("h2",{id:"commits-de-work-in-progress"},'Commits de "Work In Progress"'),(0,r.kt)("p",null,'Afin de pr\xe9server un arbre des commits propres, il sera n\xe9cessaire de supprimer les commits dits "wip" \xe0 l\'aide la\nfonction ',(0,r.kt)("inlineCode",{parentName:"p"},"rebase")," propos\xe9e par Git."),(0,r.kt)("p",null,"Exemple qui permet de r\xe9ecrire l'arbre des 4 derniers commits :"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"$ git rebase -i head~4\n")),(0,r.kt)("p",null,'Si votre dernier commit est un "wip" que vous avez remis au propre, vous pouvez simplement l\'amend comme ci-dessous :'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"$ git commit --amend\n")),(0,r.kt)("p",null,"\u26a0\ufe0f Nous ne squasherons pas nos commits lors du merge d'une branche dans la branche ",(0,r.kt)("inlineCode",{parentName:"p"},"main"),"."),(0,r.kt)("h2",{id:"strat\xe9gie-de-merge"},"Strat\xe9gie de merge"),(0,r.kt)("h3",{id:"code-review"},"Code Review"),(0,r.kt)("p",null,'Nous allons nous baser sur la convention "',(0,r.kt)("a",{parentName:"p",href:"https://www.conventionalcommits.org/en/v1.0.0/"},"Conventional Comments"),'".'),(0,r.kt)("p",null,"Chaque Pull Request (PR) devra \xeatre approuv\xe9e a minima par une personne n'ayant pas travaill\xe9 sur le ticket en rapport\navec la PR."),(0,r.kt)("h3",{id:"pull-request-interm\xe9diaire-sur-de-gros-tickets"},"Pull request interm\xe9diaire sur de gros tickets"),(0,r.kt)("p",null,"S'organiser par d\xe9p\xf4t/bin\xf4me."))}d.isMDXComponent=!0}}]);