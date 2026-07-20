# ── CloudWatch Log Group for Application Logs ─────────────────
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/talentpilot/application-logs"
  retention_in_days = 7 # Keep logs 7 days to stay in free tier limits

  tags = {
    Name = "${var.project_name}-cloudwatch-logs"
  }
}

# ── CloudWatch Alarm: EC2 High CPU Utilization (>80%) ───────
resource "aws_cloudwatch_metric_alarm" "ec2_high_cpu" {
  alarm_name          = "${var.project_name}-ec2-high-cpu"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This metric monitors EC2 instance CPU utilization"

  dimensions = {
    InstanceId = aws_instance.k3s_node.id
  }

  tags = {
    Name = "${var.project_name}-ec2-cpu-alarm"
  }
}

# ── CloudWatch Alarm: RDS Low Freeable Memory (<100MB) ──────
resource "aws_cloudwatch_metric_alarm" "rds_low_memory" {
  alarm_name          = "${var.project_name}-rds-low-memory"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "FreeableMemory"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 104857600 # 100 MB in Bytes
  alarm_description   = "Triggers when RDS free memory falls below 100MB"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }

  tags = {
    Name = "${var.project_name}-rds-memory-alarm"
  }
}

# ── CloudWatch Alarm: RDS Low Storage (<2GB) ─────────────────
resource "aws_cloudwatch_metric_alarm" "rds_low_storage" {
  alarm_name          = "${var.project_name}-rds-low-storage"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 2147483648 # 2 GB in Bytes
  alarm_description   = "Triggers when RDS free storage falls below 2GB"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }

  tags = {
    Name = "${var.project_name}-rds-storage-alarm"
  }
}
