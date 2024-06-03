"use strict";(self.webpackChunk_1j1s_etl_docs=self.webpackChunk_1j1s_etl_docs||[]).push([[746],{7170:e=>{e.exports=JSON.parse('{"version":{"pluginId":"default","version":"current","label":"Future version \ud83d\udea7","banner":null,"badge":false,"noIndex":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"tutorialSidebar":[{"type":"link","label":"\ud83d\uddfa\ufe0f Architecture","href":"/1j1s-etl/docs/architecture","docId":"architecture","unlisted":false},{"type":"category","label":"\ud83d\udcd3 ADRs","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"Historisation des flux extraits","href":"/1j1s-etl/docs/adr/2022-07-08.historisation-des-flux","docId":"adr/2022-07-08.historisation-des-flux","unlisted":false},{"type":"link","label":"Enregistrement des fichiers","href":"/1j1s-etl/docs/adr/2022-08-01.enregistrement-des-fichiers","docId":"adr/2022-08-01.enregistrement-des-fichiers","unlisted":false},{"type":"link","label":"Utilisation des Scheduled Tasks","href":"/1j1s-etl/docs/adr/2022-08-03.scheduled-tasks","docId":"adr/2022-08-03.scheduled-tasks","unlisted":false},{"type":"link","label":"Mise en Production","href":"/1j1s-etl/docs/adr/2022-11-07.mise-en-production","docId":"adr/2022-11-07.mise-en-production","unlisted":false},{"type":"link","label":"Onion Architecture","href":"/1j1s-etl/docs/adr/2023-01-28.onion-architecture","docId":"adr/2023-01-28.onion-architecture","unlisted":false},{"type":"link","label":"Les contextes d\'un commit","href":"/1j1s-etl/docs/adr/2023-01-30.contexte-commit","docId":"adr/2023-01-30.contexte-commit","unlisted":false},{"type":"link","label":"Exception dans le linter","href":"/1j1s-etl/docs/adr/2023-02-08.exception-dans-le-linter","docId":"adr/2023-02-08.exception-dans-le-linter","unlisted":false},{"type":"link","label":"Migration vers NestJS","href":"/1j1s-etl/docs/adr/2023-02-15.migration-nestjs","docId":"adr/2023-02-15.migration-nestjs","unlisted":false}],"href":"/1j1s-etl/docs/category/-adrs"},{"type":"category","label":"\u2696\ufe0f Conventions","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"Git","href":"/1j1s-etl/docs/conventions/git","docId":"conventions/git","unlisted":false},{"type":"link","label":"Langages","href":"/1j1s-etl/docs/conventions/langages","docId":"conventions/langages","unlisted":false}],"href":"/1j1s-etl/docs/category/\ufe0f-conventions"},{"type":"category","label":"\ud83c\udf31 Onboarding","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"Checklist d\'onboarding","href":"/1j1s-etl/docs/onboarding/checklist","docId":"onboarding/checklist","unlisted":false},{"type":"link","label":"Pr\xe9requis d\'installation","href":"/1j1s-etl/docs/onboarding/prerequis","docId":"onboarding/prerequis","unlisted":false},{"type":"link","label":"Lancer l\'ETL","href":"/1j1s-etl/docs/onboarding/installation","docId":"onboarding/installation","unlisted":false}],"href":"/1j1s-etl/docs/category/-onboarding"},{"type":"category","label":"\ud83e\uddd1\u200d\ud83c\udf93 Tutoriels","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"Que faire si tout se passe mal apr\xe8s une mise en production ?","href":"/1j1s-etl/docs/tuto/sos","docId":"tuto/sos","unlisted":false},{"type":"link","label":"Comment Rollback la base de donn\xe9es ?","href":"/1j1s-etl/docs/tuto/rollback-database","docId":"tuto/rollback-database","unlisted":false},{"type":"link","label":"Comment purger les donn\xe9es ?","href":"/1j1s-etl/docs/tuto/purge-des-donnees","docId":"tuto/purge-des-donnees","unlisted":false},{"type":"link","label":"Minio, comment \xe7a marche ?","href":"/1j1s-etl/docs/tuto/consulter-contenu-minio","docId":"tuto/consulter-contenu-minio","unlisted":false},{"type":"link","label":"Les Scheduled tasks, comment \xe7a marche ?","href":"/1j1s-etl/docs/tuto/scheduled-tasks","docId":"tuto/scheduled-tasks","unlisted":false},{"type":"link","label":"Que faire Lorsque le flux ne se mets plus \xe0 jour ?","href":"/1j1s-etl/docs/tuto/le_flux_ne_met_plus_a_jour","docId":"tuto/le_flux_ne_met_plus_a_jour","unlisted":false},{"type":"link","label":"Comment resynchroniser les donn\xe9es Meilisearch avec celles de Strapi ?","href":"/1j1s-etl/docs/tuto/resynchronisation-meilisearch-strapi","docId":"tuto/resynchronisation-meilisearch-strapi","unlisted":false},{"type":"link","label":"Comment cr\xe9er un nouveau bucket sur Minio","href":"/1j1s-etl/docs/tuto/creer-nouveau-bucket-minio","docId":"tuto/creer-nouveau-bucket-minio","unlisted":false}],"href":"/1j1s-etl/docs/category/-tutoriels"}]},"docs":{"adr/2022-07-08.historisation-des-flux":{"id":"adr/2022-07-08.historisation-des-flux","title":"Historisation des flux extraits","description":"8 juillet 2022","sidebar":"tutorialSidebar"},"adr/2022-08-01.enregistrement-des-fichiers":{"id":"adr/2022-08-01.enregistrement-des-fichiers","title":"Enregistrement des fichiers","description":"1er ao\xfbt 2022","sidebar":"tutorialSidebar"},"adr/2022-08-03.scheduled-tasks":{"id":"adr/2022-08-03.scheduled-tasks","title":"Utilisation des Scheduled Tasks","description":"3 ao\xfbt 2022","sidebar":"tutorialSidebar"},"adr/2022-11-07.mise-en-production":{"id":"adr/2022-11-07.mise-en-production","title":"Mise en Production","description":"7 novembre 2022","sidebar":"tutorialSidebar"},"adr/2023-01-28.onion-architecture":{"id":"adr/2023-01-28.onion-architecture","title":"Onion Architecture","description":"28 janvier 2023","sidebar":"tutorialSidebar"},"adr/2023-01-30.contexte-commit":{"id":"adr/2023-01-30.contexte-commit","title":"Les contextes d\'un commit","description":"30 janvier 2023","sidebar":"tutorialSidebar"},"adr/2023-02-08.exception-dans-le-linter":{"id":"adr/2023-02-08.exception-dans-le-linter","title":"Exception dans le linter","description":"8 f\xe9vrier 2023","sidebar":"tutorialSidebar"},"adr/2023-02-15.migration-nestjs":{"id":"adr/2023-02-15.migration-nestjs","title":"Migration vers NestJS","description":"15 f\xe9vrier 2023","sidebar":"tutorialSidebar"},"architecture":{"id":"architecture","title":"Architecture de l\'ETL","description":"10 Mars 2023","sidebar":"tutorialSidebar"},"conventions/git":{"id":"conventions/git","title":"Standards d\'\xe9quipe li\xe9s \xe0 Git","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"conventions/langages":{"id":"conventions/langages","title":"Standards d\'\xe9quipe li\xe9s au Code","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"onboarding/checklist":{"id":"onboarding/checklist","title":"Checklist d\'onboarding","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"onboarding/installation":{"id":"onboarding/installation","title":"Lancer l\'ETL","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"onboarding/prerequis":{"id":"onboarding/prerequis","title":"Pr\xe9requis d\'installation","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/consulter-contenu-minio":{"id":"tuto/consulter-contenu-minio","title":"Comment consulter le contenu du d\xe9p\xf4t MinIO","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/creer-nouveau-bucket-minio":{"id":"tuto/creer-nouveau-bucket-minio","title":"Comment cr\xe9er un nouveau bucket sur Minio","description":"01 Ao\xfbt 2023","sidebar":"tutorialSidebar"},"tuto/le_flux_ne_met_plus_a_jour":{"id":"tuto/le_flux_ne_met_plus_a_jour","title":"Lorsque le flux ne se mets plus \xe0 jour","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/purge-des-donnees":{"id":"tuto/purge-des-donnees","title":"Purge des donn\xe9es","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/resynchronisation-meilisearch-strapi":{"id":"tuto/resynchronisation-meilisearch-strapi","title":"Resynchroniser les donn\xe9es Meilisearch avec celles de Strapi","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/rollback-database":{"id":"tuto/rollback-database","title":"Rollback de base de donn\xe9es","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/scheduled-tasks":{"id":"tuto/scheduled-tasks","title":"Utiliser les Scheduled Tasks Scalingo","description":"20 Avril 2023","sidebar":"tutorialSidebar"},"tuto/sos":{"id":"tuto/sos","title":"Que faire si tout se passe mal apr\xe8s une mise en production ?","description":"20 Avril 2023","sidebar":"tutorialSidebar"}}}}')}}]);