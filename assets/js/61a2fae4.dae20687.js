"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[659],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),p=u(n),d=o,f=p["".concat(l,".").concat(d)]||p[d]||m[d]||i;return n?r.createElement(f,a(a({ref:t},s),{},{components:n})):r.createElement(f,a({ref:t},s))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[p]="string"==typeof e?e:o,a[1]=c;for(var u=2;u<i;u++)a[u]=n[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3155:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>m,frontMatter:()=>i,metadata:()=>c,toc:()=>u});var r=n(7462),o=(n(7294),n(3905));const i={},a="Les contextes d'un commit",c={unversionedId:"adr/2023-01-30.contexte-commit",id:"adr/2023-01-30.contexte-commit",title:"Les contextes d'un commit",description:"30 janvier 2023",source:"@site/docs/adr/2023-01-30.contexte-commit.md",sourceDirName:"adr",slug:"/adr/2023-01-30.contexte-commit",permalink:"/1j1s-etl/docs/adr/2023-01-30.contexte-commit",draft:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/adr/2023-01-30.contexte-commit.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Onion Architecture",permalink:"/1j1s-etl/docs/adr/2023-01-28.onion-architecture"},next:{title:"Exception dans le linter",permalink:"/1j1s-etl/docs/adr/2023-02-08.exception-dans-le-linter"}},l={},u=[{value:"Contributeurs",id:"contributeurs",level:2},{value:"Statut",id:"statut",level:2},{value:"Contexte",id:"contexte",level:2},{value:"D\xe9cision",id:"d\xe9cision",level:2},{value:"Cons\xe9quences",id:"cons\xe9quences",level:2}],s={toc:u},p="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(p,(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"les-contextes-dun-commit"},"Les contextes d'un commit"),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"30 janvier 2023")),(0,o.kt)("h2",{id:"contributeurs"},"Contributeurs"),(0,o.kt)("p",null,"S\xe9bastien F."),(0,o.kt)("h2",{id:"statut"},"Statut"),(0,o.kt)("p",null,"Accept\xe9"),(0,o.kt)("h2",{id:"contexte"},"Contexte"),(0,o.kt)("p",null,"Lorsque nous \xe9crivons un message de commit, nous ne savons pas toujours quel contexte mettre pour suivre la norme\nconventionnal commit. De ce fait, nos changelogs sont assez h\xe9t\xe9rog\xe8nes."),(0,o.kt)("h2",{id:"d\xe9cision"},"D\xe9cision"),(0,o.kt)("p",null,"C'est pourquoi nous proposons les contextes de commit suivants :"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"architecture")," - pour toute modification de l'architecture du projet"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"cli")," - pour toute modification de la CLI"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"configuration")," - pour toute modification de configuration, incluant la configuration des modules"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"dependencies")," - pour toute modification ayant trait aux d\xe9pendances du projet"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"evenements")," - pour toute modification ayant trait aux \xe9v\xe9nements"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"logements")," - pour toute modification ayant trait aux annonces de logements"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"multiple")," - pour toute modification ayant trait \xe0 2 ou plusieurs contextes"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"partag\xe9")," - pour toute modification ayant trait au shared kernel"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"stages")," - pour toute modification ayant trait aux offres de stages")),(0,o.kt)("h2",{id:"cons\xe9quences"},"Cons\xe9quences"),(0,o.kt)("p",null,"Les commits futurs utiliseront ces diff\xe9rents contextes."))}m.isMDXComponent=!0}}]);