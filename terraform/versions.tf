terraform {
  # Version minimale de Terraform CLI requise pour ce projet
  required_version = "~> 1.5"

  backend "s3" {
    # Pour la connexion au backend S3 Minio, il faut configurer en variables d'environnements :
    # AWS_ACCESS_KEY_ID : le login de l'utilisateur Minio
    # AWS_SECRET_ACCESS_KEY : le mot de passe de l'utilisateur Minio
    # AWS_ENDPOINT_URL_S3 : l'URL de l'API Minio

    # Le chemin du fichier de state sera de la forme : "{workspace_key_prefix}/{TF_WORKSPACE}/{key}"
    key                  = "state/etl.tfstate"
    workspace_key_prefix = "workspaces"

    # Le bucket S3 doit déjà exister
    bucket = "1j1s-terraform-remote-state-applications"

    # On est obligé de configurer une région bidon car on utilise Minio au lieu d'AWS
    region = "lorem-ipsum"

    # Les options ci-dessous sont nécessaires pour utiliser le backend S3 Minio :

    # 1. The env var AWS_ENDPOINT_URL_S3 needs to be set to the Minio URL
    # 2. parce que la STS API n'existe pas avec Minio
    skip_credentials_validation = true
    # 3. parce que l'AWS Metadata API n'existe pas avec Minio
    skip_metadata_api_check = true
    # 4. parce que Minio n'utilise pas les même régions que AWS
    skip_region_validation = true
    # 5. parce que Minio n'implémente pas IAM, STS API et metadata API
    skip_requesting_account_id = true
    # 6. parce que Minio ne supporte pas le virtual-hosted-style
    use_path_style = true
    # 7. parce que Minipo ne supporte pas le calcul de checksum lors de l'upload
    skip_s3_checksum = true
  }

  required_providers {
    scalingo = {
      source  = "Scalingo/scalingo"
      version = "~> 2.3"
    }

    dotenv = {
      source  = "jrhouston/dotenv"
      version = "~> 1.0"
    }
  }
}

provider "scalingo" {
  # Afin de ne pas stocker de token dans le code source, pour utiliser le provider Scalingo
  # il faut configurer en variables d'environnements :
  # SCALINGO_API_TOKEN : le token d'authentification de l'utilisateur Scalingo ("tk-us-...")
  # SCALINGO_REGION : la région de l'API Scalingo ("osc-fr1" ou "osc-secnum-fr1")
}
