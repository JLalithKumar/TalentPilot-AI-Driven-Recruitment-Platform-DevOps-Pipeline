# ──────────────────────────────────────────────────────────────
# Outputs — printed after `terraform apply`; use these to
# configure kubectl and application settings
# ──────────────────────────────────────────────────────────────

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "k3s_public_ip" {
  description = "Public IP of the K3s EC2 instance (Access your app here!)"
  value       = aws_instance.k3s_node.public_ip
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint — use as SPRING_DATASOURCE_URL host"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "s3_resume_bucket" {
  description = "S3 bucket name for resume storage"
  value       = aws_s3_bucket.resumes.bucket
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for docker push"
  value = {
    for name, repo in aws_ecr_repository.services : name => repo.repository_url
  }
}

output "kubeconfig_command" {
  description = "Run this command to get your Kubeconfig for the K3s cluster"
  value       = "aws ssm get-parameter --name /talentpilot/kubeconfig --with-decryption --query Parameter.Value --output text > kubeconfig.yaml && export KUBECONFIG=$PWD/kubeconfig.yaml"
}
