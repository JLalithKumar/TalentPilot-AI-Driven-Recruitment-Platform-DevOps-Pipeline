# ── ECR Repositories ─────────────────────────────────────────
resource "aws_ecr_repository" "services" {
  for_each             = toset(var.ecr_repos)
  name                 = each.key
  image_tag_mutability = "MUTABLE"   # Allow overwriting :latest

  image_scanning_configuration {
    scan_on_push = true   # Automatic vulnerability scanning on every push
  }

  tags = { Name = each.key }
}

# Lifecycle policy — keep only the 10 most recent tagged images per repo
resource "aws_ecr_lifecycle_policy" "services" {
  for_each   = aws_ecr_repository.services
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}
