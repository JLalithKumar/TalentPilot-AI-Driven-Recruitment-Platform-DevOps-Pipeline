# ── RDS Subnet Group ──────────────────────────────────────────
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.public[*].id
  tags       = { Name = "${var.project_name}-db-subnet-group" }
}

# ── RDS PostgreSQL Instance ───────────────────────────────────
resource "aws_db_instance" "postgres" {
  identifier        = "${var.project_name}-postgres"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = var.db_instance_class # Must be db.t3.micro or db.t4g.micro for free tier
  allocated_storage = 20                    # Free tier max is 20GB

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # MUST BE FALSE FOR FREE TIER! Multi-AZ costs money.
  multi_az = false

  # Automated backups disabled for student free tier compliance
  backup_retention_period = 0
  # backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  # Performance Insights (Turned off for free tier safety, though 7-day retention is often free)
  performance_insights_enabled = false

  deletion_protection = false
  skip_final_snapshot = true

  tags = { Name = "${var.project_name}-postgres" }
}
