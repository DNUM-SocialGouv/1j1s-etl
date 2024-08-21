"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[757],{6072:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>o,contentTitle:()=>l,default:()=>a,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var t=n(4848),i=n(8453);const r={},l="Utilisation des Scheduled Tasks",d={id:"adr/2022-08-03.scheduled-tasks",title:"Utilisation des Scheduled Tasks",description:"3 ao\xfbt 2022",source:"@site/docs/adr/2022-08-03.scheduled-tasks.md",sourceDirName:"adr",slug:"/adr/2022-08-03.scheduled-tasks",permalink:"/1j1s-etl/docs/adr/2022-08-03.scheduled-tasks",draft:!1,unlisted:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/adr/2022-08-03.scheduled-tasks.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Enregistrement des fichiers",permalink:"/1j1s-etl/docs/adr/2022-08-01.enregistrement-des-fichiers"},next:{title:"Mise en Production",permalink:"/1j1s-etl/docs/adr/2022-11-07.mise-en-production"}},o={},c=[{value:"Contributeurs",id:"contributeurs",level:2},{value:"Statut",id:"statut",level:2},{value:"Contexte",id:"contexte",level:2},{value:"D\xe9cision",id:"d\xe9cision",level:2},{value:"Cons\xe9quences",id:"cons\xe9quences",level:2},{value:"Autres pistes explor\xe9es",id:"autres-pistes-explor\xe9es",level:2}];function u(e){const s={em:"em",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"utilisation-des-scheduled-tasks",children:"Utilisation des Scheduled Tasks"})}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.em,{children:"3 ao\xfbt 2022"})}),"\n",(0,t.jsx)(s.h2,{id:"contributeurs",children:"Contributeurs"}),"\n",(0,t.jsx)(s.p,{children:"Simon B., S\xe9bastien F."}),"\n",(0,t.jsx)(s.h2,{id:"statut",children:"Statut"}),"\n",(0,t.jsx)(s.p,{children:"Accept\xe9"}),"\n",(0,t.jsx)(s.h2,{id:"contexte",children:"Contexte"}),"\n",(0,t.jsx)(s.p,{children:"Afin de transformer et de charger ponctuellement des stages, nous avons initialement choisi d'utiliser les Custom Clock\nProcesses de Scalingo plut\xf4t que les Scheduled Tasks (en beta)."}),"\n",(0,t.jsx)(s.p,{children:"Le probl\xe8me rencontr\xe9 est que, contrairement aux Scheduled Tasks, les Custom Clock Processes sont des containers\nScalingo qui tournent 24h/24. De ce fait, la facturation de ces Custom Clock Processes \xe9tait drastiquement plus ch\xe8re\nque pour les Scheduled Tasks."}),"\n",(0,t.jsx)(s.h2,{id:"d\xe9cision",children:"D\xe9cision"}),"\n",(0,t.jsx)(s.p,{children:"Nous avons d\xe9cid\xe9 de migrer vers les Scheduled Tasks de Scalingo pour r\xe9soudre cette probl\xe9matique d'h\xe9bergement."}),"\n",(0,t.jsx)(s.h2,{id:"cons\xe9quences",children:"Cons\xe9quences"}),"\n",(0,t.jsx)(s.p,{children:"Point(s) positif(s) :"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Le co\xfbt d'h\xe9bergement est beaucoup plus bas ;"}),"\n",(0,t.jsx)(s.li,{children:"Nous pouvons modifier des variables d'environnement \xe0 la vol\xe9e qui seront prises en compte au prochain lancement de la\nt\xe2che"}),"\n",(0,t.jsx)(s.li,{children:"Il est plus simple de monitorer les Scheduled Tasks."}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Point(s) n\xe9gatif(s) :"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Le temps d'ex\xe9cution des crons ne peuvent pas d\xe9passer 15 mins ;"}),"\n",(0,t.jsx)(s.li,{children:"Il y a une intervalle entre deux ex\xe9cutions d'un m\xeame cron \xe0 respecter ;"}),"\n",(0,t.jsx)(s.li,{children:"On ne peut plus modifier l'intervalle d'ex\xe9cution des crons via des variables d'environnement ;"}),"\n",(0,t.jsx)(s.li,{children:"On ne peut plus ex\xe9cuter le cron \xe0 l'initialisation."}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"autres-pistes-explor\xe9es",children:"Autres pistes explor\xe9es"}),"\n",(0,t.jsx)(s.p,{children:"Les Custom Clock Processes ont \xe9t\xe9 pr\xe9alablement utilis\xe9s mais leur co\xfbt d'h\xe9bergement \xe9tait trop important."})]})}function a(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(u,{...e})}):u(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>l,x:()=>d});var t=n(6540);const i={},r=t.createContext(i);function l(e){const s=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),t.createElement(r.Provider,{value:s},e.children)}}}]);