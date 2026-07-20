# 🚀 TalentPilot — AI-Driven Recruitment Platform & DevOps Pipeline

[![Build Status](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-blue?logo=githubactions)](.github/workflows/ci-cd.yml)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-orange?logo=argo)](devops/argocd/application.yaml)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s-blue?logo=kubernetes)](devops/k8s/combined.yaml)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-purple?logo=terraform)](devops/terraform)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-green?logo=springboot)](backend)
[![FastAPI](https://img.shields.io/badge/AI_Engine-FastAPI_Python_3.11-teal?logo=fastapi)](ai-service)
[![React](https://img.shields.io/badge/Frontend-React_18_TypeScript-cyan?logo=react)](frontend)

**TalentPilot** is an enterprise-grade, AI-powered recruitment management system paired with an end-to-end cloud-native **DevOps Infrastructure Pipeline**. The platform automates resume parsing, skill extraction, and candidate job matching using Natural Language Processing (NLP), while providing recruiters with a real-time Kanban applicant tracking system (ATS).

---

## 🏗️ System Architecture & Infrastructure Pipeline

```
                                  +-------------------+
                                  |   Web Browser     |
                                  |  (React 18 + TS)  |
                                  +---------+---------+
                                            |
                                     Port 80 / HTTP
                                            v
                                  +-------------------+
                                  |   Nginx Reverse   |
                                  |      Proxy        |
                                  +----+--------+-----+
                                       |        |
                         +-------------+        +-------------+
                         |                                    |
                  Port 8081 / API                      Port 8000 / API
                         v                                    v
              +--------------------+               +--------------------+
              | Spring Boot 3 REST |               | Python FastAPI AI  |
              |   (Java 21 JDK)    |               |  Resume Engine     |
              +----+----------+----+               +---------+----------+
                   |          |                              |
                   |          +---------------+--------------+
                   v                          v
       +-----------------------+   +--------------------+
       | AWS RDS PostgreSQL 15 |   | AWS S3 / MinIO     |
       |  (Relational Storage) |   | (Resume Documents) |
       +-----------------------+   +--------------------+
                                              
 ----------------------------------------------------------------------------------
                              OBSERVABILITY & GITOPS
 ----------------------------------------------------------------------------------
     +-------------------+      +-------------------+      +-------------------+
     | Prometheus (9090) | ---->|   Grafana (3000)  |      |   ArgoCD GitOps   |
     | (Metrics Scraper) |      | (Visual Dashboard)|      |   (Sync Engine)   |
     +-------------------+      +-------------------+      +-------------------+
```

---

## 🌟 Key Features & Capabilities

### 💼 Candidate Experience
* **Automated Profile Parsing:** Upload PDF resumes for instant NLP-based skill, experience, and contact extraction.
* **AI Match Scoring:** Real-time semantic matching score (%) calculated against job posting requirements.
* **Kanban Tracking:** Monitor job application stages in real-time (`APPLIED` ➔ `REVIEWING` ➔ `SHORTLISTED` ➔ `REJECTED`).

### 🎯 Recruiter Management
* **Job Creation & Requirement Parsing:** Create job listings with automated requirement extraction.
* **Visual Applicant Pipeline:** Interactive drag-and-drop Kanban board to manage candidate stages.
* **Candidate Ranking:** Sort applicants by AI match score to prioritize top talent.

---

## 🛠️ Technology Stack Breakdown

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v3 | Modern dark-mode glassmorphism UI with smooth animations. |
| **Backend Service** | Java 21, Spring Boot 3, Spring Data JPA, Spring Security | Stateless JWT authentication, RBAC, RESTful endpoints. |
| **AI Microservice** | Python 3.11, FastAPI, PyMuPDF, spaCy NLP | High-performance PDF parsing and semantic text scoring. |
| **Database** | PostgreSQL 15 (AWS RDS) | Production-grade relational database with connection pooling. |
| **Object Storage** | AWS S3 / MinIO | Encrypted bucket for candidate resume documents. |
| **Infrastructure as Code** | Terraform | AWS VPC, Subnets, Security Groups, IAM, RDS, and S3 provisioning. |
| **Orchestration** | Docker Compose, Kubernetes (K3s), Helm v3 | Multi-container local & cloud deployment specs. |
| **Autoscaling** | Kubernetes HPA | Dynamic scaling (2 to 5 replicas based on CPU/RAM thresholds). |
| **Observability** | Prometheus, Grafana | Real-time JVM metrics, FastAPI request latency, system dashboards. |
| **CI/CD & GitOps** | GitHub Actions, ArgoCD | 3-stage automated build/test pipeline & continuous GitOps deployment. |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* [Docker & Docker Compose](https://docs.docker.com/get-docker/) installed.

### 1. Launch All Microservices
Run Docker Compose to build and start the entire multi-service stack:
```bash
docker-compose -f docker-compose.full.yml up --build -d
```

### 2. Live Local Endpoints
* **Web UI (React Frontend):** [http://localhost](http://localhost)
* **Core Backend API:** `http://localhost:8080/api/v1`
* **AI Service Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **MinIO Object Storage Console:** [http://localhost:9001](http://localhost:9001) *(Credentials: `admin` / `password123`)*

---

## ☁️ Cloud Infrastructure & Deployment (AWS)

### Provisioning Infrastructure with Terraform
```bash
cd devops/terraform
terraform init
terraform plan
terraform apply -auto-approve -var="db_password=YourSecretPassword123!"
```

### Production Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (K3s) & Helm Deployment
```bash
# Apply native K8s manifests and HorizontalPodAutoscaler
kubectl apply -f devops/k8s/combined.yaml
kubectl apply -f devops/k8s/hpa.yaml

# Or install via Helm chart
helm upgrade --install talentpilot ./devops/helm/talentpilot -n talentpilot-prod --create-namespace
```

---

## 🐙 CI/CD & GitOps Automation

### 1. GitHub Actions Pipeline ([`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml))
* **Stage 1 (CI):** Parallel unit testing for Java Spring Boot (`mvn test`), React frontend (`npm run build`), and Python FastAPI (`flake8`).
* **Stage 2 (Docker Build & Push):** Multi-arch image build tagged with Git SHA (`:${{ github.sha }}`) and `:latest`.
* **Stage 3 (CD):** Dynamic Kubernetes manifest deployment and rolling update verification.

### 2. ArgoCD Continuous Delivery ([`devops/argocd/application.yaml`](devops/argocd/application.yaml))
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: talentpilot-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/JLalithKumar/Talent-Pilot.git'
    targetRevision: HEAD
    path: devops/k8s
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: talentpilot-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## 📊 Observability & Monitoring

* **Prometheus Metrics Scraper:** Running on port `9090` scraping Spring Boot `/actuator/prometheus` and FastAPI metrics.
* **Grafana Visual Dashboards:** Running on port `3000` (`admin` / `admin`) with custom JVM, database connection pool, and HTTP response throughput panels.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
