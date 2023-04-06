"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[727],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>f});var n=t(7294);function l(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function u(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){l(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,l=function(e,r){if(null==e)return{};var t,n,l={},u=Object.keys(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||(l[t]=e[t]);return l}(e,r);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}var o=n.createContext({}),s=function(e){var r=n.useContext(o),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},p=function(e){var r=s(e.components);return n.createElement(o.Provider,{value:r},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,l=e.mdxType,u=e.originalType,o=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=s(t),d=l,f=c["".concat(o,".").concat(d)]||c[d]||m[d]||u;return t?n.createElement(f,a(a({ref:r},p),{},{components:t})):n.createElement(f,a({ref:r},p))}));function f(e,r){var t=arguments,l=r&&r.mdxType;if("string"==typeof e||l){var u=t.length,a=new Array(u);a[0]=d;var i={};for(var o in r)hasOwnProperty.call(r,o)&&(i[o]=r[o]);i.originalType=e,i[c]="string"==typeof e?e:l,a[1]=i;for(var s=2;s<u;s++)a[s]=t[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6161:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>o,contentTitle:()=>a,default:()=>m,frontMatter:()=>u,metadata:()=>i,toc:()=>s});var n=t(7462),l=(t(7294),t(3905));const u={},a="Lorsque le flux ne se mets plus \xe0 jour",i={unversionedId:"maintenance/le_flux_ne_met_plus_a_jour",id:"maintenance/le_flux_ne_met_plus_a_jour",title:"Lorsque le flux ne se mets plus \xe0 jour",description:"D\xe9tail de l\u2019erreur",source:"@site/docs/maintenance/le_flux_ne_met_plus_a_jour.md",sourceDirName:"maintenance",slug:"/maintenance/le_flux_ne_met_plus_a_jour",permalink:"/1j1s-etl/docs/maintenance/le_flux_ne_met_plus_a_jour",draft:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/maintenance/le_flux_ne_met_plus_a_jour.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Proc\xe9dures de maintenance",permalink:"/1j1s-etl/docs/maintenance/"},next:{title:"Pr\xe9requis et conseils",permalink:"/1j1s-etl/docs/maintenance/prerequis"}},o={},s=[{value:"D\xe9tail de l\u2019erreur",id:"d\xe9tail-de-lerreur",level:2},{value:"Analyse de l\u2019erreur",id:"analyse-de-lerreur",level:2},{value:"Origine possible de l\u2019erreur",id:"origine-possible-de-lerreur",level:3},{value:"Que faire",id:"que-faire",level:2}],p={toc:s},c="wrapper";function m(e){let{components:r,...t}=e;return(0,l.kt)(c,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"lorsque-le-flux-ne-se-mets-plus-\xe0-jour"},"Lorsque le flux ne se mets plus \xe0 jour"),(0,l.kt)("h2",{id:"d\xe9tail-de-lerreur"},"D\xe9tail de l\u2019erreur"),(0,l.kt)("p",null,"Le flux ne se met plus \xe0 jour sur Strapi ou plusieurs offres sont toujours disponibles pour le flux mais ces derni\xe8res sont peut \xeatre obsol\xe8tes."),(0,l.kt)("h2",{id:"analyse-de-lerreur"},"Analyse de l\u2019erreur"),(0,l.kt)("p",null,"V\xe9rifier si les t\xe2ches crons fonctionnent : "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Sur les buckets de Minio les fichiers latest ne sont plus \xe0 la date du jour"),(0,l.kt)("li",{parentName:"ul"},"Sur les buckets de Minio, le r\xe9pertoire history ou les fichiers historiques pr\xe9sents dans ce r\xe9pertoire ne sont plus \xe0 la date du jour ou sont supprim\xe9s.  (NB : un fichier vide fait 2b) ")),(0,l.kt)("h3",{id:"origine-possible-de-lerreur"},"Origine possible de l\u2019erreur"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"La taille du flux est devenue trop grande pour le container"),(0,l.kt)("li",{parentName:"ul"},"Une erreur appara\xeet dans un des cron")),(0,l.kt)("h2",{id:"que-faire"},"Que faire"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Dans un premier temps, trouver quel cron ne parvient plus \xe0 assurer les mises \xe0 jour du flux."),(0,l.kt)("li",{parentName:"ul"},"Dans un second temps, rep\xe9rer l\u2019origine de l\u2019erreur.",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Si c\u2019est une erreur, analyser et corriger le bogue."),(0,l.kt)("li",{parentName:"ul"},"Si c\u2019est la taille du flux qui pose probl\xe8me, augmenter la taille du container dans le fichier cron.json. (voir les valeurs de m\xe9moire associ\xe9es au pricing sur ",(0,l.kt)("a",{parentName:"li",href:"https://scalingo.com/fr/pricing"},"https://scalingo.com/fr/pricing"),")",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"S = 250 mo"),(0,l.kt)("li",{parentName:"ul"},"M = 512 mo"),(0,l.kt)("li",{parentName:"ul"},"L = 1 Go"),(0,l.kt)("li",{parentName:"ul"},"XL = 2 Go"),(0,l.kt)("li",{parentName:"ul"},"2XL = 4 Go")))))))}m.isMDXComponent=!0}}]);