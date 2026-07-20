variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev / staging / prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name prefix used for resource naming"
  type        = string
  default     = "talentpilot"
}

# ── VPC ──────────────────────────────────────────────────────
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# ── EC2 (K3s) ────────────────────────────────────────────────
variable "k3s_instance_type" {
  description = "EC2 instance type for K3s (t2.micro or t3.micro for free tier)"
  type        = string
  default     = "t3.micro"
}

# ── RDS ──────────────────────────────────────────────────────
variable "db_instance_class" {
  description = "RDS instance class (db.t3.micro or db.t4g.micro for free tier)"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  type    = string
  default = "talentpilotdb"
}

variable "db_username" {
  type      = string
  sensitive = true
  default   = "talentpilot"
}

variable "db_password" {
  type      = string
  sensitive = true
  # Set this via: terraform apply -var="db_password=YourSecurePass123"
}

# ── ECR ──────────────────────────────────────────────────────
variable "ecr_repos" {
  description = "List of ECR repository names to create"
  type        = list(string)
  default     = ["talentpilot-backend", "talentpilot-frontend", "talentpilot-ai-service"]
}
