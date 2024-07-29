"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[669],{894:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>u,frontMatter:()=>o,metadata:()=>t,toc:()=>d});var i=r(4848),s=r(8453);const o={},c="Mise en Production",t={id:"adr/2022-11-07.mise-en-production",title:"Mise en Production",description:"7 novembre 2022",source:"@site/docs/adr/2022-11-07.mise-en-production.md",sourceDirName:"adr",slug:"/adr/2022-11-07.mise-en-production",permalink:"/1j1s-etl/docs/adr/2022-11-07.mise-en-production",draft:!1,unlisted:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/adr/2022-11-07.mise-en-production.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Utilisation des Scheduled Tasks",permalink:"/1j1s-etl/docs/adr/2022-08-03.scheduled-tasks"},next:{title:"Onion Architecture",permalink:"/1j1s-etl/docs/adr/2023-01-28.onion-architecture"}},l={},d=[{value:"Contributeurs",id:"contributeurs",level:2},{value:"Statut",id:"statut",level:2},{value:"Contexte",id:"contexte",level:2},{value:"D\xe9cision",id:"d\xe9cision",level:2},{value:"1. Cr\xe9ation d&#39;une version",id:"1-cr\xe9ation-dune-version",level:3},{value:"2. Cr\xe9er la branche li\xe9e \xe0 la version",id:"2-cr\xe9er-la-branche-li\xe9e-\xe0-la-version",level:3},{value:"3. D\xe9ployer la branche versionn\xe9e",id:"3-d\xe9ployer-la-branche-versionn\xe9e",level:3},{value:"Cons\xe9quences",id:"cons\xe9quences",level:2}];function a(e){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"mise-en-production",children:"Mise en Production"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"7 novembre 2022"})}),"\n",(0,i.jsx)(n.h2,{id:"contributeurs",children:"Contributeurs"}),"\n",(0,i.jsx)(n.p,{children:"S\xe9bastien F."}),"\n",(0,i.jsx)(n.h2,{id:"statut",children:"Statut"}),"\n",(0,i.jsx)(n.p,{children:"Accept\xe9"}),"\n",(0,i.jsx)(n.h2,{id:"contexte",children:"Contexte"}),"\n",(0,i.jsx)(n.p,{children:"Lorsque nous devons faire un rollback d'une mise en production (MEP), nous souhaitons que cela se\nfasse \xe0 partir de la derni\xe8re version qui a \xe9t\xe9 mise en production."}),"\n",(0,i.jsx)(n.p,{children:"Il a \xe9t\xe9 d\xe9cid\xe9 que les MEP soient effectu\xe9s une \xe0 deux fois par it\xe9ration."}),"\n",(0,i.jsx)(n.h2,{id:"d\xe9cision",children:"D\xe9cision"}),"\n",(0,i.jsx)(n.p,{children:"Pour pouvoir facilement revenir \xe0 la version pr\xe9c\xe9dente, il faudrait que nous ayons un historique pr\xe9cis des diff\xe9rentes\nversions qui sont parties en production."}),"\n",(0,i.jsx)(n.h3,{id:"1-cr\xe9ation-dune-version",children:"1. Cr\xe9ation d'une version"}),"\n",(0,i.jsxs)(n.p,{children:["Nous utilisons actuellement ",(0,i.jsx)(n.code,{children:"release-please"})," afin de g\xe9n\xe9rer des versions et des notes de version."]}),"\n",(0,i.jsxs)(n.p,{children:["Une version sera cr\xe9\xe9e \xe0 chaque fois qu'un commit poss\xe9dant les mots cl\xe9s ",(0,i.jsx)(n.code,{children:"feat"})," ou ",(0,i.jsx)(n.code,{children:"fix"})," sera merg\xe9 sur ",(0,i.jsx)(n.code,{children:"main"}),". Une\nversion sera \xe9galement cr\xe9\xe9e \xe0 chaque introduction d'un ",(0,i.jsx)(n.code,{children:"breaking change"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Par exemples :"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Breaking change : ",(0,i.jsx)(n.code,{children:"chore!: modification drastique dans l'utilisation de l'application"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Fonctionnalit\xe9 : ",(0,i.jsx)(n.code,{children:"feat(stages): ajout d'une nouvelle fonctionnalit\xe9"})]}),"\n",(0,i.jsxs)(n.li,{children:["Correction de bug : ",(0,i.jsx)(n.code,{children:"fix(stages): correction d'un bug"})]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["En suivant le principe de ",(0,i.jsx)(n.code,{children:"semantic versionning"}),", le premier exemple provoquera une mont\xe9e de version majeure : ",(0,i.jsx)(n.code,{children:"1.0.0"}),"\n-> ",(0,i.jsx)(n.code,{children:"2.0.0"}),", le second exemple provoquera une mont\xe9e de version mineure : ",(0,i.jsx)(n.code,{children:"1.0.0"})," -> ",(0,i.jsx)(n.code,{children:"1.1.0"})," et le dernier exemple\nprovoquera une mont\xe9e de version corrective : ",(0,i.jsx)(n.code,{children:"1.0.0"})," -> ",(0,i.jsx)(n.code,{children:"1.0.1"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Il est \xe9galement possible de forcer la cr\xe9ation d'une version en le pr\xe9cisant dans un commit vide."}),"\n",(0,i.jsxs)(n.p,{children:["Par exemple : ",(0,i.jsx)(n.code,{children:'git commit --allow-empty -m "chore(some context): release 2.0.1" -m "Release-As: 2.0.1"'}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["\u26a0\ufe0f ",(0,i.jsx)(n.code,{children:"release-please"})," va cr\xe9er une ",(0,i.jsx)(n.code,{children:"Pull Request"})," qu'il est imp\xe9ratif de merger pour cr\xe9er un ",(0,i.jsx)(n.code,{children:"tag"})," (au sens Git) et pour\ncr\xe9er les notes de version associ\xe9es."]}),"\n",(0,i.jsx)(n.h3,{id:"2-cr\xe9er-la-branche-li\xe9e-\xe0-la-version",children:"2. Cr\xe9er la branche li\xe9e \xe0 la version"}),"\n",(0,i.jsxs)(n.p,{children:["Scalingo ne nous permet pas actuellement d\xe9ployer un ",(0,i.jsx)(n.code,{children:"tag"}),". De ce fait, il vous faudra n\xe9cessairement cr\xe9er une branche\nde ",(0,i.jsx)(n.code,{children:"release"}),". La nomenclature \xe0 suivre serait id\xe9alement la suivante : ",(0,i.jsx)(n.code,{children:"release/<num\xe9ro de version>"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Par exemple :"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.code,{children:"release/2.8.3"})}),"\n",(0,i.jsx)(n.h3,{id:"3-d\xe9ployer-la-branche-versionn\xe9e",children:"3. D\xe9ployer la branche versionn\xe9e"}),"\n",(0,i.jsx)(n.p,{children:"Deux options sont possibles :"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"Par le client Web Scalingo et s\xe9lectionner la branche en question \xe0 d\xe9ployer ;"}),"\n",(0,i.jsxs)(n.li,{children:["Par le d\xe9p\xf4t ",(0,i.jsx)(n.code,{children:"1j1s-infrastructure"})," apr\xe8s modifi\xe9 la variable d'environnement de la branche \xe0 d\xe9ployer."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"cons\xe9quences",children:"Cons\xe9quences"}),"\n",(0,i.jsxs)(n.p,{children:["Une mise \xe0 jour du code du d\xe9p\xf4t ",(0,i.jsx)(n.code,{children:"1j1s-infrastructure"})," est n\xe9cessaire."]}),"\n",(0,i.jsx)(n.p,{children:"Enfin, nous pourrons effectuer un rollback de l'application en toute s\xe9curit\xe9."})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>c,x:()=>t});var i=r(6540);const s={},o=i.createContext(s);function c(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);