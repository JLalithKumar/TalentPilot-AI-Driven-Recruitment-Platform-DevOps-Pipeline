# TalentPilot — Terraform Infrastructure

This Terraform configuration provisions the complete AWS infrastructure for TalentPilot in production.

## Architecture

```
                          ┌─────────────────────────────────────────────────────┐
                          │                   AWS Cloud                          │
                          │                                                       │
                          │   ┌─────────────┐        ┌─────────────────────┐    │
  Internet ──────────────►│   │ Public Subnet│        │   Private Subnet    │    │
                          │   │             │        │                     │    │
                          │   │  Internet   │        │   EKS Node Group    │    │
                          │   │  Gateway    │        │   (t3.medium x2-6)  │    │
                          │   │  NAT GW     │        │                     │    │
                          │   │  ALB/Ingress│        │   RDS PostgreSQL     │    │
                          │   └─────────────┘        │   (db.t3.micro)     │    │
                          │                          └─────────────────────┘    │
                          │   ┌──────────────────┐                              │
                          │   │  ECR Repositories│                              │
                          │   │  - backend        │                              │
                          │   │  - frontend       │                              │
                          │   │  - ai-service     │                              │
                          │   └──────────────────┘                              │
                          │   ┌──────────────────┐                              │
                          │   │  S3 Buckets       │                              │
                          │   │  - resumes        │                              │
                          │   │  - terraform state│                              │
                          │   └──────────────────┘                              │
                          └─────────────────────────────────────────────────────┘
```

## Files

| File | Purpose |
|---|---|
| `main.tf` | Provider config and S3 remote backend |
| `variables.tf` | All input variables |
| `vpc.tf` | VPC, subnets, IGW, NAT, route tables, security groups |
| `eks.tf` | EKS cluster, IAM roles, managed node group |
| `rds.tf` | RDS PostgreSQL with multi-AZ, backups, encryption |
| `s3.tf` | S3 buckets for resumes and Terraform state |
| `ecr.tf` | ECR repos with scan-on-push and lifecycle policy |
| `outputs.tf` | Exported values (endpoints, bucket names, etc.) |

## Usage

### Prerequisites
- AWS CLI configured (`aws configure`)
- Terraform >= 1.6

### First Run (bootstrap)
```bash
# 1. Comment out the backend "s3" block in main.tf initially
# 2. Init and apply to create the S3 state bucket
cd devops/terraform
terraform init
terraform apply -target=aws_s3_bucket.terraform_state

# 3. Re-enable the backend block, then:
terraform init -migrate-state
```

### Deploy all infrastructure
```bash
terraform plan -var="db_password=YourSecurePassword123"
terraform apply -var="db_password=YourSecurePassword123"
```

### Configure kubectl after apply
```bash
aws eks update-kubeconfig --region us-east-1 --name talentpilot-eks
kubectl get nodes
```

### Deploy the app to the new cluster
```bash
# Replace placeholder username with ECR URLs from terraform output
kubectl apply -f ../k8s/setup.yaml
kubectl apply -f ../k8s/configmap.yaml
kubectl apply -f ../k8s/databases/
kubectl apply -f ../k8s/services/
kubectl apply -f ../k8s/ingress.yaml
```

### Deploy monitoring
```bash
kubectl apply -f ../monitoring/prometheus.yaml
kubectl apply -f ../monitoring/grafana.yaml
kubectl apply -f ../monitoring/loki.yaml
```

## GitHub Secrets Required for CI/CD

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `KUBE_CONFIG` | Base64-encoded kubeconfig for the EKS cluster |

### Get kubeconfig for CI/CD:
```bash
aws eks update-kubeconfig --name talentpilot-eks --region us-east-1
cat ~/.kube/config | base64  # Paste this into GitHub Secret KUBE_CONFIG
```

## Tear Down
```bash
terraform destroy -var="db_password=YourSecurePassword123"
```
