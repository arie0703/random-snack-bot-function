terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = ">= 3.74.2"
        }
        template = {
            source = "hashicorp/template"
            version = ">= 2.2.0"
        }
    }
    required_version = ">= 1.0"
}

provider "aws" {
    profile = var.profile
    region  = "ap-northeast-1"
}
