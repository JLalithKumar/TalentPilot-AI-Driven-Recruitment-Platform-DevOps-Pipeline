#!/usr/bin/env bash
# 🐙 TalentPilot — ArgoCD GitOps Setup Script for Kubernetes / K3s

set -e

echo "🚀 Installing ArgoCD in namespace 'argocd'..."

# 1. Create argocd namespace
kubectl create namespace argocd || true

# 2. Install ArgoCD core manifests
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Wait for ArgoCD server to be ready
echo "⏳ Waiting for ArgoCD server pods to be ready..."
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s || true

# 4. Port forward ArgoCD UI locally (Port 8082)
echo "🌐 Exposing ArgoCD UI on port 8082..."
# kubectl port-forward svc/argocd-server -n argocd 8082:443 &

# 5. Fetch default admin password
echo "🔑 Initial ArgoCD Admin Password:"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""

echo "📄 Apply TalentPilot ArgoCD Application:"
echo "kubectl apply -f devops/argocd/application.yaml"
