"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[56],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var a=r.createContext({}),u=function(e){var t=r.useContext(a),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(a.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,o=e.originalType,a=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=u(n),m=s,f=d["".concat(a,".").concat(m)]||d[m]||p[m]||o;return n?r.createElement(f,l(l({ref:t},c),{},{components:n})):r.createElement(f,l({ref:t},c))}));function f(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var a in t)hasOwnProperty.call(t,a)&&(i[a]=t[a]);i.originalType=e,i[d]="string"==typeof e?e:s,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5363:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var r=n(7462),s=(n(7294),n(3905));const o={},l="Utilisation des Scheduled Tasks",i={unversionedId:"adr/2022-08-03.scheduled-tasks",id:"adr/2022-08-03.scheduled-tasks",title:"Utilisation des Scheduled Tasks",description:"3 ao\xfbt 2022",source:"@site/docs/adr/2022-08-03.scheduled-tasks.md",sourceDirName:"adr",slug:"/adr/2022-08-03.scheduled-tasks",permalink:"/1j1s-etl/docs/adr/2022-08-03.scheduled-tasks",draft:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/adr/2022-08-03.scheduled-tasks.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Enregistrement des fichiers",permalink:"/1j1s-etl/docs/adr/2022-08-01.enregistrement-des-fichiers"},next:{title:"Mise en Production",permalink:"/1j1s-etl/docs/adr/2022-11-07.mise-en-production"}},a={},u=[{value:"Contributeurs",id:"contributeurs",level:2},{value:"Statut",id:"statut",level:2},{value:"Contexte",id:"contexte",level:2},{value:"D\xe9cision",id:"d\xe9cision",level:2},{value:"Cons\xe9quences",id:"cons\xe9quences",level:2},{value:"Autres pistes explor\xe9es",id:"autres-pistes-explor\xe9es",level:2}],c={toc:u},d="wrapper";function p(e){let{components:t,...n}=e;return(0,s.kt)(d,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"utilisation-des-scheduled-tasks"},"Utilisation des Scheduled Tasks"),(0,s.kt)("p",null,(0,s.kt)("em",{parentName:"p"},"3 ao\xfbt 2022")),(0,s.kt)("h2",{id:"contributeurs"},"Contributeurs"),(0,s.kt)("p",null,"Simon B., S\xe9bastien F."),(0,s.kt)("h2",{id:"statut"},"Statut"),(0,s.kt)("p",null,"Accept\xe9"),(0,s.kt)("h2",{id:"contexte"},"Contexte"),(0,s.kt)("p",null,"Afin de transformer et de charger ponctuellement des stages, nous avons initialement choisi d'utiliser les Custom Clock\nProcesses de Scalingo plut\xf4t que les Scheduled Tasks (en beta)."),(0,s.kt)("p",null,"Le probl\xe8me rencontr\xe9 est que, contrairement aux Scheduled Tasks, les Custom Clock Processes sont des containers\nScalingo qui tournent 24h/24. De ce fait, la facturation de ces Custom Clock Processes \xe9tait drastiquement plus ch\xe8re\nque pour les Scheduled Tasks."),(0,s.kt)("h2",{id:"d\xe9cision"},"D\xe9cision"),(0,s.kt)("p",null,"Nous avons d\xe9cid\xe9 de migrer vers les Scheduled Tasks de Scalingo pour r\xe9soudre cette probl\xe9matique d'h\xe9bergement."),(0,s.kt)("h2",{id:"cons\xe9quences"},"Cons\xe9quences"),(0,s.kt)("p",null,"Point(s) positif(s) :"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"Le co\xfbt d'h\xe9bergement est beaucoup plus bas ;"),(0,s.kt)("li",{parentName:"ul"},"Nous pouvons modifier des variables d'environnement \xe0 la vol\xe9e qui seront prises en compte au prochain lancement de la\nt\xe2che"),(0,s.kt)("li",{parentName:"ul"},"Il est plus simple de monitorer les Scheduled Tasks.")),(0,s.kt)("p",null,"Point(s) n\xe9gatif(s) :"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"Le temps d'ex\xe9cution des crons ne peuvent pas d\xe9passer 15 mins ;"),(0,s.kt)("li",{parentName:"ul"},"Il y a une intervalle entre deux ex\xe9cutions d'un m\xeame cron \xe0 respecter ;"),(0,s.kt)("li",{parentName:"ul"},"On ne peut plus modifier l'intervalle d'ex\xe9cution des crons via des variables d'environnement ;"),(0,s.kt)("li",{parentName:"ul"},"On ne peut plus ex\xe9cuter le cron \xe0 l'initialisation.")),(0,s.kt)("h2",{id:"autres-pistes-explor\xe9es"},"Autres pistes explor\xe9es"),(0,s.kt)("p",null,"Les Custom Clock Processes ont \xe9t\xe9 pr\xe9alablement utilis\xe9s mais leur co\xfbt d'h\xe9bergement \xe9tait trop important."))}p.isMDXComponent=!0}}]);