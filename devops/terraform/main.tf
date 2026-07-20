terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state stored in S3 (bootstrap bucket must exist first)
  # backend "s3" {
  #   bucket = "talentpilot-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "TalentPilot"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
