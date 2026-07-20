# ── IAM Role for EC2 Instance ─────────────────────────────────
resource "aws_iam_role" "k3s_node" {
  name = "${var.project_name}-k3s-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Allow EC2 to pull from ECR
resource "aws_iam_role_policy_attachment" "ecr_readonly" {
  role       = aws_iam_role.k3s_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# Allow EC2 to be managed via AWS Systems Manager (SSM) - No SSH keys needed!
resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.k3s_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance Profile
resource "aws_iam_instance_profile" "k3s_node" {
  name = "${var.project_name}-k3s-profile"
  role = aws_iam_role.k3s_node.name
}

# ── EC2 Instance for K3s ─────────────────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "k3s_node" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.k3s_instance_type

  # Place in the first public subnet
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.k3s_node.id]
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.k3s_node.name

  root_block_device {
    volume_size = 20 # Free tier includes up to 30GB EBS
    volume_type = "gp3"
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # 1. Create a 2GB Swap file to prevent Out-Of-Memory (OOM) on 1GB RAM instances
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab

    # Adjust swappiness
    sysctl vm.swappiness=10
    echo 'vm.swappiness=10' >> /etc/sysctl.conf

    # 2. Install dependencies
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common jq unzip

    # 3. Install AWS CLI v2
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    ./aws/install

    # 4. Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker ubuntu

    # 5. ECR Credential Helper (so K3s can pull private images)
    apt-get install -y amazon-ecr-credential-helper
    mkdir -p /etc/docker
    echo '{"credsStore": "ecr-login"}' > /etc/docker/config.json
    systemctl restart docker

    # 6. Install K3s (Lightweight Kubernetes) using Docker runtime
    curl -sfL https://get.k3s.io | sh -s - --docker --write-kubeconfig-mode 644

    # 7. Export Kubeconfig for easy access
    export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
    
    # Store kubeconfig in an SSM parameter so we can easily retrieve it from our local machine
    aws ssm put-parameter \
      --name "/talentpilot/kubeconfig" \
      --type "SecureString" \
      --value "$(cat /etc/rancher/k3s/k3s.yaml | sed "s/127.0.0.1/$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/g")" \
      --overwrite \
      --region ${var.aws_region}
  EOF

  tags = {
    Name = "${var.project_name}-k3s-node"
  }
}

# Allow EC2 to write the Kubeconfig to SSM Parameter Store
resource "aws_iam_role_policy" "ssm_put_param" {
  name = "${var.project_name}-ssm-put-param"
  role = aws_iam_role.k3s_node.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["ssm:PutParameter", "ssm:GetParameter"]
        Effect   = "Allow"
        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/talentpilot/kubeconfig"
      }
    ]
  })
}

data "aws_caller_identity" "current" {}
