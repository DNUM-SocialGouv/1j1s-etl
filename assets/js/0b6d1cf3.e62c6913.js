"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[538],{9468:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>o,contentTitle:()=>t,default:()=>a,frontMatter:()=>i,metadata:()=>u,toc:()=>c});var n=s(4848),l=s(8453);const i={sidebar_label:"Que faire Lorsque le flux ne se mets plus \xe0 jour ?",sidebar_position:5},t="Lorsque le flux ne se mets plus \xe0 jour",u={id:"tuto/le_flux_ne_met_plus_a_jour",title:"Lorsque le flux ne se mets plus \xe0 jour",description:"20 Avril 2023 (mis \xe0 jour le 24 Juillet 2024)",source:"@site/docs/tuto/le_flux_ne_met_plus_a_jour.md",sourceDirName:"tuto",slug:"/tuto/le_flux_ne_met_plus_a_jour",permalink:"/1j1s-etl/docs/tuto/le_flux_ne_met_plus_a_jour",draft:!1,unlisted:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/tuto/le_flux_ne_met_plus_a_jour.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_label:"Que faire Lorsque le flux ne se mets plus \xe0 jour ?",sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Comment cr\xe9er un nouveau bucket sur Minio",permalink:"/1j1s-etl/docs/tuto/creer-nouveau-bucket-minio"},next:{title:"Les Scheduled tasks, comment \xe7a marche ?",permalink:"/1j1s-etl/docs/tuto/scheduled-tasks"}},o={},c=[{value:"Analyse de l\u2019erreur",id:"analyse-de-lerreur",level:2},{value:"Origine possible de l\u2019erreur",id:"origine-possible-de-lerreur",level:3},{value:"Que faire",id:"que-faire",level:2}];function d(e){const r={a:"a",admonition:"admonition",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,l.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"lorsque-le-flux-ne-se-mets-plus-\xe0-jour",children:"Lorsque le flux ne se mets plus \xe0 jour"})}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.em,{children:"20 Avril 2023 (mis \xe0 jour le 24 Juillet 2024)"})}),"\n",(0,n.jsx)(r.admonition,{title:"Contexte",type:"info",children:(0,n.jsx)(r.p,{children:"Le flux ne se met plus \xe0 jour sur Strapi ou plusieurs offres sont toujours disponibles pour le flux mais ces derni\xe8res sont peut \xeatre obsol\xe8tes."})}),"\n",(0,n.jsx)(r.h2,{id:"analyse-de-lerreur",children:"Analyse de l\u2019erreur"}),"\n",(0,n.jsx)(r.p,{children:"V\xe9rifier si les t\xe2ches crons fonctionnent :"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Sur les buckets de Minio les fichiers latest ne sont plus \xe0 la date du jour"}),"\n",(0,n.jsx)(r.li,{children:"Sur les buckets de Minio, le r\xe9pertoire history ou les fichiers historiques pr\xe9sents dans ce r\xe9pertoire ne sont plus \xe0 la date du jour ou sont supprim\xe9s.  (NB : un fichier vide fait 2b)"}),"\n"]}),"\n",(0,n.jsx)(r.h3,{id:"origine-possible-de-lerreur",children:"Origine possible de l\u2019erreur"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"La taille du flux est devenue trop grande pour le container"}),"\n",(0,n.jsx)(r.li,{children:"Une erreur appara\xeet dans un des cron"}),"\n"]}),"\n",(0,n.jsx)(r.h2,{id:"que-faire",children:"Que faire"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Dans un premier temps, trouver quel cron ne parvient plus \xe0 assurer les mises \xe0 jour du flux."}),"\n",(0,n.jsxs)(r.li,{children:["Dans un second temps, rep\xe9rer l\u2019origine de l\u2019erreur.","\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Si c\u2019est une erreur, analyser et corriger le bogue."}),"\n",(0,n.jsxs)(r.li,{children:["Si c\u2019est la taille du flux qui pose probl\xe8me, augmenter la taille du container dans le fichier cron.json. (voir les valeurs de m\xe9moire associ\xe9es au pricing sur ",(0,n.jsx)(r.a,{href:"https://scalingo.com/fr/pricing",children:"https://scalingo.com/fr/pricing"}),")","\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"S = 250 mo"}),"\n",(0,n.jsx)(r.li,{children:"M = 512 mo"}),"\n",(0,n.jsx)(r.li,{children:"L = 1 Go"}),"\n",(0,n.jsx)(r.li,{children:"XL = 2 Go"}),"\n",(0,n.jsx)(r.li,{children:"2XL = 4 Go"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]})]})}function a(e={}){const{wrapper:r}={...(0,l.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},8453:(e,r,s)=>{s.d(r,{R:()=>t,x:()=>u});var n=s(6540);const l={},i=n.createContext(l);function t(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function u(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),n.createElement(i.Provider,{value:r},e.children)}}}]);