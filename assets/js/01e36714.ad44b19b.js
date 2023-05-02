"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[603],{3905:(e,t,a)=>{a.d(t,{Zo:()=>i,kt:()=>m});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var d=n.createContext({}),u=function(e){var t=n.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},i=function(e){var t=u(e.components);return n.createElement(d.Provider,{value:t},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,d=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),c=u(a),b=r,m=c["".concat(d,".").concat(b)]||c[b]||p[b]||s;return a?n.createElement(m,o(o({ref:t},i),{},{components:a})):n.createElement(m,o({ref:t},i))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,o=new Array(s);o[0]=b;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l[c]="string"==typeof e?e:r,o[1]=l;for(var u=2;u<s;u++)o[u]=a[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}b.displayName="MDXCreateElement"},9501:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>p,frontMatter:()=>s,metadata:()=>l,toc:()=>u});var n=a(7462),r=(a(7294),a(3905));const s={sidebar_label:"Comment Rollback la base de donn\xe9es ?",sidebar_position:1},o="Rollback de base de donn\xe9es",l={unversionedId:"tuto/rollback-database",id:"tuto/rollback-database",title:"Rollback de base de donn\xe9es",description:"20 Avril 2023",source:"@site/docs/tuto/rollback-database.md",sourceDirName:"tuto",slug:"/tuto/rollback-database",permalink:"/1j1s-etl/docs/tuto/rollback-database",draft:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/tuto/rollback-database.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_label:"Comment Rollback la base de donn\xe9es ?",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Que faire si tout se passe mal apr\xe8s une mise en production ?",permalink:"/1j1s-etl/docs/tuto/sos"},next:{title:"Comment purger les donn\xe9es ?",permalink:"/1j1s-etl/docs/tuto/purge-des-donnees"}},d={},u=[{value:"Acc\xe9der au dashboard de la base de donn\xe9es",id:"acc\xe9der-au-dashboard-de-la-base-de-donn\xe9es",level:2},{value:"Cr\xe9er une backup de la base de donn\xe9es",id:"cr\xe9er-une-backup-de-la-base-de-donn\xe9es",level:2},{value:"Restaurer la base de donn\xe9es \xe0 une date pr\xe9cise",id:"restaurer-la-base-de-donn\xe9es-\xe0-une-date-pr\xe9cise",level:2},{value:"Restaurer la base de donn\xe9es depuis le dump que vous avez g\xe9n\xe9r\xe9",id:"restaurer-la-base-de-donn\xe9es-depuis-le-dump-que-vous-avez-g\xe9n\xe9r\xe9",level:2}],i={toc:u},c="wrapper";function p(e){let{components:t,...s}=e;return(0,r.kt)(c,(0,n.Z)({},i,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"rollback-de-base-de-donn\xe9es"},"Rollback de base de donn\xe9es"),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"20 Avril 2023")),(0,r.kt)("h2",{id:"acc\xe9der-au-dashboard-de-la-base-de-donn\xe9es"},"Acc\xe9der au dashboard de la base de donn\xe9es"),(0,r.kt)("p",null,"Scalingo propose avec ses offres payantes d'automatiser la cr\xe9ation de backup d'une base de donn\xe9es p\xe9riodiquement (et\nc'est d\xe9j\xe0 fait pour les environnements de production)."),(0,r.kt)("p",null,"Maintenant, vous allez peut-\xeatre vouloir cr\xe9er une back-up manuellement. Pour ce faire, il faut se rendre sur Scalingo,\nl\xe0 o\xf9 les ressources d'une application sont d\xe9taill\xe9es :"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"img",src:a(9651).Z,width:"1523",height:"621"})),(0,r.kt)("p",null,"Ensuite, cliquez sur le bouton ",(0,r.kt)("inlineCode",{parentName:"p"},"Go to dashboard")," \xe0 c\xf4t\xe9 de l'addon correspondant \xe0 votre base de donn\xe9es. Cela va ouvrir\nune fen\xeatre avec le dashboard correspondant \xe0 votre base de donn\xe9es."),(0,r.kt)("h2",{id:"cr\xe9er-une-backup-de-la-base-de-donn\xe9es"},"Cr\xe9er une backup de la base de donn\xe9es"),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"Parce qu'on ne sait jamais !")),(0,r.kt)("p",null,"Maintenant, vous avez le dashboard ci-dessous devant les yeux :"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"img",src:a(6539).Z,width:"1867",height:"933"})),(0,r.kt)("p",null,"Rendez vous sur l'onglet ",(0,r.kt)("inlineCode",{parentName:"p"},"Backups"),", en haut \xe0 droite :"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"img",src:a(9729).Z,width:"1875",height:"948"})),(0,r.kt)("p",null,"Pour cr\xe9er votre backup, il vous suffit maintenant d'appuyer sur le bouton ",(0,r.kt)("inlineCode",{parentName:"p"},"Make manual backup"),". Vous le verrez\nappara\xeetre dans la liste des backups disponibles sur la droite de l'interface. T\xe9l\xe9chargez cette sauvegarde via le\nbouton ",(0,r.kt)("inlineCode",{parentName:"p"},"Download")," \xe0 l'\xe9cran."),(0,r.kt)("h2",{id:"restaurer-la-base-de-donn\xe9es-\xe0-une-date-pr\xe9cise"},"Restaurer la base de donn\xe9es \xe0 une date pr\xe9cise"),(0,r.kt)("p",null,"Il vous est maintenant possible de restaurer la base de donn\xe9es \xe0 un point donn\xe9 dans le temps. Choisissez l'heure \xe0\nlaquelle vous souhaitez restaurer la base de donn\xe9es puis appuyez sur ",(0,r.kt)("inlineCode",{parentName:"p"},"Restore database"),"."),(0,r.kt)("h2",{id:"restaurer-la-base-de-donn\xe9es-depuis-le-dump-que-vous-avez-g\xe9n\xe9r\xe9"},"Restaurer la base de donn\xe9es depuis le dump que vous avez g\xe9n\xe9r\xe9"),(0,r.kt)("p",null,"Dans certains cas, vous pourriez \xeatre amen\xe9s \xe0 restaurer la base de donn\xe9es depuis le dump que vous avez g\xe9n\xe9r\xe9 plus t\xf4t."),(0,r.kt)("p",null,"Dans ce cas-l\xe0, r\xe9f\xe9rez-vous directement \xe0 la ",(0,r.kt)("a",{parentName:"p",href:"https://doc.scalingo.com/databases/postgresql/dump-restore"},"documentation de Scalingo"),"\nsur le sujet."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"And voil\xe0 !")))}p.isMDXComponent=!0},9729:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/backups-6298a89dd3122d81672fc45f490765dc.png"},6539:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/dashboard-bdd-568af82117ec0c6881203fbc0b03d70c.png"},9651:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/onglet-scalingo-app-201ffa658f12eb12c44b0d0b88306359.png"}}]);