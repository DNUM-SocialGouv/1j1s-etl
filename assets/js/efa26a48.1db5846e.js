"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[744],{6295:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>a,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var s=t(4848),r=t(8453);const i={},o="Exception dans le linter",c={id:"adr/2023-02-08.exception-dans-le-linter",title:"Exception dans le linter",description:"8 f\xe9vrier 2023",source:"@site/docs/adr/2023-02-08.exception-dans-le-linter.md",sourceDirName:"adr",slug:"/adr/2023-02-08.exception-dans-le-linter",permalink:"/1j1s-etl/docs/adr/2023-02-08.exception-dans-le-linter",draft:!1,unlisted:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/adr/2023-02-08.exception-dans-le-linter.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Les contextes d'un commit",permalink:"/1j1s-etl/docs/adr/2023-01-30.contexte-commit"},next:{title:"Migration vers NestJS",permalink:"/1j1s-etl/docs/adr/2023-02-15.migration-nestjs"}},d={},l=[{value:"Contributeurs",id:"contributeurs",level:2},{value:"Statut",id:"statut",level:2},{value:"Contexte",id:"contexte",level:2},{value:"D\xe9cision",id:"d\xe9cision",level:2},{value:"Cons\xe9quences",id:"cons\xe9quences",level:2}];function u(e){const n={code:"code",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"exception-dans-le-linter",children:"Exception dans le linter"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"8 f\xe9vrier 2023"})}),"\n",(0,s.jsx)(n.h2,{id:"contributeurs",children:"Contributeurs"}),"\n",(0,s.jsx)(n.p,{children:"S. Fran\xe7ois, H. Dumont"}),"\n",(0,s.jsx)(n.h2,{id:"statut",children:"Statut"}),"\n",(0,s.jsx)(n.p,{children:"Accept\xe9"}),"\n",(0,s.jsx)(n.h2,{id:"contexte",children:"Contexte"}),"\n",(0,s.jsxs)(n.p,{children:["Lorsque nous lan\xe7ons le linter sur notre code, ESLint nous remonte des warnings li\xe9s \xe0 une variable non-utilis\xe9e ou\n\xe0 des ",(0,s.jsx)(n.code,{children:"non-null assertions"})," tandis que le code au-dessus nous prot\xe8ge de ces erreurs."]}),"\n",(0,s.jsx)(n.h2,{id:"d\xe9cision",children:"D\xe9cision"}),"\n",(0,s.jsxs)(n.p,{children:["Nous avons donc d\xe9cid\xe9 d'ignorer ces deux erreurs ",(0,s.jsx)(n.code,{children:"@typescript-eslint/no-unused-vars"})," et\n",(0,s.jsx)(n.code,{children:"@typescript-eslint/no-non-null-assertion"})," dans les fichiers concern\xe9s."]}),"\n",(0,s.jsx)(n.h2,{id:"cons\xe9quences",children:"Cons\xe9quences"}),"\n",(0,s.jsx)(n.p,{children:"D'autres erreurs pourraient \xeatre occult\xe9es dans ces m\xeames fichiers s'ils \xe9voluent au fil du temps."})]})}function a(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>c});var s=t(6540);const r={},i=s.createContext(r);function o(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);