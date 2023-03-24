"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[724],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>f});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(t),m=i,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return t?r.createElement(f,o(o({ref:n},u),{},{components:t})):r.createElement(f,o({ref:n},u))}));function f(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,o=new Array(a);o[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[d]="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},3083:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=t(7462),i=(t(7294),t(3905));const a={},o="Resynchroniser les donn\xe9es Meilisearch avec celles de Strapi",s={unversionedId:"maintenance/resynchronisation-meilisearch-strapi",id:"maintenance/resynchronisation-meilisearch-strapi",title:"Resynchroniser les donn\xe9es Meilisearch avec celles de Strapi",description:"Contexte",source:"@site/docs/maintenance/resynchronisation-meilisearch-strapi.md",sourceDirName:"maintenance",slug:"/maintenance/resynchronisation-meilisearch-strapi",permalink:"/1j1s-etl/docs/maintenance/resynchronisation-meilisearch-strapi",draft:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/maintenance/resynchronisation-meilisearch-strapi.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Purge des donn\xe9es",permalink:"/1j1s-etl/docs/maintenance/purge-des-donnees"},next:{title:"Rollback de base de donn\xe9es",permalink:"/1j1s-etl/docs/maintenance/rollback-database"}},l={},c=[{value:"Contexte",id:"contexte",level:2},{value:"Qu&#39;est-ce qui nous met la puce \xe0 l&#39;oreille ?",id:"quest-ce-qui-nous-met-la-puce-\xe0-loreille-",level:2},{value:"Que faire ?",id:"que-faire-",level:2},{value:"Si \xe7a ne r\xe9sout pas le probl\xe8me ?",id:"si-\xe7a-ne-r\xe9sout-pas-le-probl\xe8me-",level:2}],u={toc:c},d="wrapper";function p(e){let{components:n,...a}=e;return(0,i.kt)(d,(0,r.Z)({},u,a,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"resynchroniser-les-donn\xe9es-meilisearch-avec-celles-de-strapi"},"Resynchroniser les donn\xe9es Meilisearch avec celles de Strapi"),(0,i.kt)("h2",{id:"contexte"},"Contexte"),(0,i.kt)("p",null,"Du fait de l'indexation document par document impos\xe9e par la strat\xe9gie d'insertion, modification et suppression d'une\nentr\xe9e dans une collection par Strapi, il peut arriver qu'une d\xe9synchronisation se produise entre Meilisearch et Strapi. "),(0,i.kt)("h2",{id:"quest-ce-qui-nous-met-la-puce-\xe0-loreille-"},"Qu'est-ce qui nous met la puce \xe0 l'oreille ?"),(0,i.kt)("p",null,"En r\xe8gle g\xe9n\xe9rale, nous nous apercevons de cette d\xe9synchronisation lorsque nous tentons d'acc\xe9der au d\xe9tail d'une offre\nde stage ou d'une annonce de logement et que l'interface utilisateur nous dit que nous n'avons pas trouv\xe9 l'offre ou\nl'annonce."),(0,i.kt)("h2",{id:"que-faire-"},"Que faire ?"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Connectez-vous \xe0 l'application ",(0,i.kt)("inlineCode",{parentName:"li"},"Main CMS")," de production, si vous ne savez pas o\xf9 trouver les identifiants, demandez ;"),(0,i.kt)("li",{parentName:"ol"},"Arriv\xe9 sur l'interface administrateur, vous trouverez un onglet ",(0,i.kt)("inlineCode",{parentName:"li"},"Meilisearch")," sur le panneau de gauche, cliquez\ndessus ;"),(0,i.kt)("li",{parentName:"ol"},"Cherchez ensuite dans la liste des collections celle qui pose soucis ;"),(0,i.kt)("li",{parentName:"ol"},"Si une d\xe9synchronisation est en effet d'actualit\xe9, vous devriez voir un diff\xe9rentiel entre le nombre de documents\npr\xe9sents en base de donn\xe9es et le nombre d'entr\xe9es de la collection dans la base de donn\xe9es de Strapi :")),(0,i.kt)("p",null,"Exemple sans d\xe9synchronisation :"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"ex sans d\xe9synchronisation",src:t(3438).Z,width:"1522",height:"66"})),(0,i.kt)("p",null,"Exemple avec d\xe9synchronisation :"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"ex avec d\xe9synchronisation",src:t(9570).Z,width:"1541",height:"67"})),(0,i.kt)("ol",{start:5},(0,i.kt)("li",{parentName:"ol"},"Vous voyez un bouton ",(0,i.kt)("inlineCode",{parentName:"li"},"Update"),"tout \xe0 droite de la ligne qui vous permet de purger les documents de ladite collection\nsur Meilisearch et de les r\xe9indexer par batch, cliquez dessus une fois et soyez patient ;"),(0,i.kt)("li",{parentName:"ol"},"Attendez un moment puis v\xe9rifiez si la d\xe9synchronisation a disparu.")),(0,i.kt)("h2",{id:"si-\xe7a-ne-r\xe9sout-pas-le-probl\xe8me-"},"Si \xe7a ne r\xe9sout pas le probl\xe8me ?"),(0,i.kt)("p",null,"Vous pouvez investiguer davantage en manipulant directement l'\n",(0,i.kt)("a",{parentName:"p",href:"https://docs.meilisearch.com/reference/api/overview.html"},"API de Meilisearch")," pour voir si l'indexation est toujours\nen cours ou non, voir si des documents ont bel et bien \xe9t\xe9 envoy\xe9s \xe0 Meilisearch etc..."),(0,i.kt)("p",null,"Essayez de durcir les m\xe9thodes li\xe9es \xe0 la transformation de vos donn\xe9es dans l'application ",(0,i.kt)("inlineCode",{parentName:"p"},"Main CMS")," pour voir si cela\nr\xe9sout votre probl\xe8me."))}p.isMDXComponent=!0},9570:(e,n,t)=>{t.d(n,{Z:()=>r});const r=t.p+"assets/images/synchronisation-nok-730cb8d81a9c01048f8240b104e88eed.png"},3438:(e,n,t)=>{t.d(n,{Z:()=>r});const r=t.p+"assets/images/synchronisation-ok-728e2ed3e17f6263600c002a0f6befb6.png"}}]);