"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[128],{9893:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>c,contentTitle:()=>d,default:()=>u,frontMatter:()=>r,metadata:()=>l,toc:()=>o});var t=i(4848),n=i(8453);const r={},d="Enregistrement des fichiers",l={id:"adr/2022-08-01.enregistrement-des-fichiers",title:"Enregistrement des fichiers",description:"1er ao\xfbt 2022",source:"@site/docs/adr/2022-08-01.enregistrement-des-fichiers.md",sourceDirName:"adr",slug:"/adr/2022-08-01.enregistrement-des-fichiers",permalink:"/1j1s-etl/docs/adr/2022-08-01.enregistrement-des-fichiers",draft:!1,unlisted:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/adr/2022-08-01.enregistrement-des-fichiers.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Historisation des flux extraits",permalink:"/1j1s-etl/docs/adr/2022-07-08.historisation-des-flux"},next:{title:"Utilisation des Scheduled Tasks",permalink:"/1j1s-etl/docs/adr/2022-08-03.scheduled-tasks"}},c={},o=[{value:"Contributeurs",id:"contributeurs",level:2},{value:"Statut",id:"statut",level:2},{value:"Contexte",id:"contexte",level:2},{value:"D\xe9cision",id:"d\xe9cision",level:2},{value:"Cons\xe9quences",id:"cons\xe9quences",level:2},{value:"Autres pistes explor\xe9es",id:"autres-pistes-explor\xe9es",level:2}];function a(e){const s={code:"code",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"enregistrement-des-fichiers",children:"Enregistrement des fichiers"})}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.em,{children:"1er ao\xfbt 2022"})}),"\n",(0,t.jsx)(s.h2,{id:"contributeurs",children:"Contributeurs"}),"\n",(0,t.jsx)(s.p,{children:"Simon B., S\xe9bastien F."}),"\n",(0,t.jsx)(s.h2,{id:"statut",children:"Statut"}),"\n",(0,t.jsx)(s.p,{children:"Accept\xe9"}),"\n",(0,t.jsx)(s.h2,{id:"contexte",children:"Contexte"}),"\n",(0,t.jsx)(s.p,{children:"Lors de l'\xe9criture des fichiers (historisation + derni\xe8re version), nous avons le choix entre \xe9crire s\xe9quentiellement\nles deux fichiers OU parall\xe9liser les \xe9critures."}),"\n",(0,t.jsx)(s.p,{children:"Nous avons r\xe9alis\xe9 de brefs tests de performances sur des fichiers d'une taille avoisinant les 50 MiB avec les r\xe9sultats\nsuivants :"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"Strat\xe9gie d'\xe9criture"}),(0,t.jsx)(s.th,{children:"Temps d'ex\xe9cution en secondes"}),(0,t.jsx)(s.th,{children:"Contexte"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"S\xe9quentielle"}),(0,t.jsx)(s.td,{children:"11,892s"}),(0,t.jsx)(s.td,{children:"Mac SEFR, MinIO qualification"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"Parall\xe9lisation"}),(0,t.jsx)(s.td,{children:"8,768s"}),(0,t.jsx)(s.td,{children:"Mac SEFR, MinIO qualification"})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"d\xe9cision",children:"D\xe9cision"}),"\n",(0,t.jsx)(s.p,{children:"\xc9criture s\xe9quentielle car la diff\xe9rence n'est pas assez significative."}),"\n",(0,t.jsx)(s.h2,{id:"cons\xe9quences",children:"Cons\xe9quences"}),"\n",(0,t.jsx)(s.p,{children:"Positif :"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Meilleure gestion d'erreur possible"}),"\n",(0,t.jsx)(s.li,{children:"Pas de tentative d'\xe9criture du dernier fichier si l'historisation a \xe9chou\xe9"}),"\n",(0,t.jsxs)(s.li,{children:["Meilleure lisibilit\xe9 du code (pas de ",(0,t.jsx)(s.code,{children:"Promise.all"}),")"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"N\xe9gatif :"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Temps d'ex\xe9cution plus important"}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"autres-pistes-explor\xe9es",children:"Autres pistes explor\xe9es"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-typescript",children:"return Promise.all([\n    this.sauvegarderFichierAHistoriser(contenuASauvegarder, configurationFlux),\n    this.sauvegarderCloneDuDernierFichier(contenuASauvegarder, configurationFlux),\n])\n"})})]})}function u(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},8453:(e,s,i)=>{i.d(s,{R:()=>d,x:()=>l});var t=i(6540);const n={},r=t.createContext(n);function d(e){const s=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),t.createElement(r.Provider,{value:s},e.children)}}}]);