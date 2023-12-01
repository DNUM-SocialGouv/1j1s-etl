# Peut aussi être défini avec TF_VAR_nom_de_l_application
variable "nom_de_l_application" {
  description = "Nom de l'application Scalingo"
  type        = string
}

# Peut aussi être défini avec TF_VAR_fichier_env_secret
variable "fichier_env_secret" {
  description = "Nom du fichier contenant des variables d'environment, par exemple \".env\". Sera fusionné avec les variables"
  type        = string
  default     = null
}

# Peut aussi être défini avec TF_VAR_branche_git
variable "branche_git" {
  description = "Nom de la branche à déployer"
  type        = string
  default     = "main"
}

# Peut aussi être défini avec TF_VAR_logstash_uri
variable "logstash_uri" {
  description = "URI du logstash, sous le format https://user:password@host:port"
  type        = string
  sensitive   = true
}
