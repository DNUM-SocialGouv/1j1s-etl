"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[810],{5365:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>t,toc:()=>a});var i=s(4848),l=s(8453);const r={sidebar_label:"Minio, comment \xe7a marche ?",sidebar_position:3},o="Comment consulter le contenu du d\xe9p\xf4t MinIO",t={id:"tuto/consulter-contenu-minio",title:"Comment consulter le contenu du d\xe9p\xf4t MinIO",description:"20 Avril 2023 (mis \xe0 jour le 24 Juillet 2024)",source:"@site/docs/tuto/consulter-contenu-minio.md",sourceDirName:"tuto",slug:"/tuto/consulter-contenu-minio",permalink:"/1j1s-etl/docs/tuto/consulter-contenu-minio",draft:!1,unlisted:!1,editUrl:"https://github.com/DNUM-SocialGouv/1j1s-etl/tree/main/docs/docs/docs/tuto/consulter-contenu-minio.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_label:"Minio, comment \xe7a marche ?",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Comment purger les donn\xe9es ?",permalink:"/1j1s-etl/docs/tuto/purge-des-donnees"},next:{title:"Comment cr\xe9er un nouveau bucket sur Minio",permalink:"/1j1s-etl/docs/tuto/creer-nouveau-bucket-minio"}},c={},a=[{value:"Installation",id:"installation",level:2},{value:"macOS",id:"macos",level:3},{value:"Linux",id:"linux",level:3},{value:"V\xe9rifier l&#39;installation",id:"v\xe9rifier-linstallation",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Consulter les fichiers sur le d\xe9p\xf4t",id:"consulter-les-fichiers-sur-le-d\xe9p\xf4t",level:2},{value:"Supprimer un Bucket",id:"supprimer-un-bucket",level:3}];function d(e){const n={admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,l.R)(),...e.components},{Details:r}=n;return r||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"comment-consulter-le-contenu-du-d\xe9p\xf4t-minio",children:"Comment consulter le contenu du d\xe9p\xf4t MinIO"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"20 Avril 2023 (mis \xe0 jour le 24 Juillet 2024)"})}),"\n",(0,i.jsx)(n.admonition,{title:"Contexte",type:"info",children:(0,i.jsxs)(n.p,{children:["Nous utilisons l'interface ",(0,i.jsx)(n.code,{children:"Amazon Web Services Command Line Interface (CLI)"})," afin de pouvoir consulter\nle contenu du d\xe9p\xf4t de fichier MinIO que nous utilisons sur le projet."]})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"MinIO",src:s(8744).A+"",width:"676",height:"504"})}),"\n",(0,i.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,i.jsxs)(n.p,{children:["En fonction de votre environnement, vous devrez utiliser des mani\xe8res diff\xe9rentes pour installer\nl'",(0,i.jsx)(n.code,{children:"AWS CLI"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"macos",children:"macOS"}),"\n",(0,i.jsxs)(r,{children:[(0,i.jsx)("summary",{children:"Voir la proc\xe9dure"}),(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"Lancez la commande ci-dessous :"}),"\n"]}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ brew install awscli\n"})})]}),"\n",(0,i.jsx)(n.h3,{id:"linux",children:"Linux"}),"\n",(0,i.jsxs)(r,{children:[(0,i.jsx)("summary",{children:"Voir la proc\xe9dure"}),(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"Lancez la commande ci-dessous :"}),"\n"]}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"\nunzip awscliv2.zip\nsudo ./aws/install\n'})})]}),"\n",(0,i.jsx)(n.h3,{id:"v\xe9rifier-linstallation",children:"V\xe9rifier l'installation"}),"\n",(0,i.jsxs)(n.ol,{start:"2",children:["\n",(0,i.jsx)(n.li,{children:"V\xe9rifiez si la CLI s'est correctement install\xe9e avec la commande suivante :"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ aws --version\n"})}),"\n",(0,i.jsx)(n.p,{children:"R\xe9sultat attendu :"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"aws-cli/<version> Python/<version> Darwin/<version> source/<nombre de bits> prompt/<on/off>\n"})}),"\n",(0,i.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,i.jsxs)(n.p,{children:["Pour pouvoir vous connecter au d\xe9p\xf4t MinIO, vous allez devoir configurer votre CLI et en particulier\nles ",(0,i.jsx)(n.code,{children:"credentials"}),", nous y reviendrons dans un moment. Pour d\xe9marrer la configuration, il vous suffit\nde lancer la commande :"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ aws configure\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"AWS Access Key ID [None]: <contactez un membre de la team pour cette valeur>\nAWS Secret Access Key [None]: <contactez un membre de la team pour cette valeur>\nDefault region name [None]: None\nDefault output format [None]: json\n"})}),"\n",(0,i.jsx)(n.p,{children:"And voil\xe0 !"}),"\n",(0,i.jsx)(n.h2,{id:"consulter-les-fichiers-sur-le-d\xe9p\xf4t",children:"Consulter les fichiers sur le d\xe9p\xf4t"}),"\n",(0,i.jsx)(n.p,{children:"Afin de pouvoir consulter de mani\xe8re digeste les diff\xe9rents fichiers qui sont sur le d\xe9p\xf4t distant,\nutilisez la commande suivante :"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ aws --endpoint-url <url aws> s3 ls s3://<nom_du_bucket>/path/to/folder --recursive --human-readable --summarize\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"2022-07-23 07:00:00   51.4 MiB path/to/folder/history/2022-07-23T05:00:03.424Z.xml\n2022-07-24 07:00:00   48.8 MiB path/to/folder/history/2022-07-24T05:00:01.775Z.xml\n2022-07-25 07:00:00   48.5 MiB path/to/folder/history/2022-07-25T05:00:01.460Z.xml\n2022-07-25 07:00:00   48.5 MiB path/to/folder/latest.xml\n\nTotal Objects: 4\n   Total Size: 197.2 MiB\n"})}),"\n",(0,i.jsx)(n.p,{children:"Que faisons-nous ci-dessus ?"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--endpoint-url"})," nous permet de sp\xe9cifier l'URL du cloud AWS auquel nous cherchons \xe0 nous connecter."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"s3"})," signifie que nous nous connectons \xe0 un Object Cloud Storage S3 et utilise le ",(0,i.jsx)(n.code,{children:"bin"})," s3 pr\xe9sent\ndans la CLI AWS."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"ls"})," permet de lister les fichiers pr\xe9sents dans un dossier (commande Unix)."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--recursive"})," permet d'afficher le contenu des sous-dossiers s'il y en a."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--human-readable"})," permet d'afficher la sortie pour que ce soit compr\xe9hensible par l'humain."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--summarize"})," affiche des informations \xe9l\xe9mentaires (nombre d'objets, taille totale...)."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"supprimer-un-bucket",children:"Supprimer un Bucket"}),"\n",(0,i.jsx)(n.p,{children:"Afin de supprimer un bucket, utilisez la commande suivante:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ aws --endpoint-url <url aws> s3 rb s3://nom-du-bucket\n"})})]})}function u(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8744:(e,n,s)=>{s.d(n,{A:()=>i});const i=s.p+"assets/images/1j1s-minio-d39fccdf89a4421cc27b384a620cbf18.png"},8453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>t});var i=s(6540);const l={},r=i.createContext(l);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);