module "etl_app" {
  source  = "scalingo-community/app/scalingo"
  version = "0.3.2"

  stack = "scalingo-22"

  name = var.nom_de_l_application

  containers = {
    web = {
      size       = "S"
      amount     = "0"
      autoscaler = null
    }
  }

  github_integration = {
    repo_url            = "https://github.com/DNUM-SocialGouv/1j1s-etl"
    branch              = var.branche_git
    auto_deploy_enabled = (terraform.workspace == "default") ? true : false
  }

  environment = local.envs_du_fichier_env

  router_logs = true

  log_drains = (var.logstash_uri != null) ? [
    {
      type = "elk"
      url  = sensitive(var.logstash_uri)
    }
  ] : null

  # Scheculed jobs are defined in the ../cron.json file
}
