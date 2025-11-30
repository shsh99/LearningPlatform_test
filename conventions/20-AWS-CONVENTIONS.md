# 20. AWS Infrastructure Conventions

> AWS 인프라 구성 및 배포 컨벤션

---

## 빠른 탐색

| 섹션 | 내용 |
|------|------|
| [핵심 규칙](#핵심-규칙) | 5가지 AWS 원칙 |
| [아키텍처 패턴](#아키텍처-패턴) | 기본 구성, VPC |
| [서비스별 설정](#서비스별-설정) | ECS, RDS, S3+CloudFront |
| [태깅 전략](#태깅-전략) | 리소스 태깅 |
| [비밀 관리](#비밀-관리) | Secrets Manager |
| [CI/CD](#cicd-파이프라인) | GitHub Actions |
| [비용 최적화](#비용-최적화) | 프리티어, 절감 |

---

## 핵심 규칙

```
✅ 환경별 분리 → dev/staging/prod 계정 또는 VPC
✅ IAM 최소 권한 원칙 → 필요한 권한만 부여
✅ 비밀값은 Secrets Manager → 코드에 하드코딩 금지
✅ 태깅 필수 → 비용 추적, 리소스 관리
✅ IaC 사용 → Terraform 또는 CloudFormation
```

---

## 아키텍처 패턴

### 기본 구성 (소규모)

```
Internet
    ↓
Route 53 (DNS)
    ↓
CloudFront (CDN) ─→ S3 (Frontend Static)
    ↓
ALB (Application Load Balancer)
    ↓
ECS Fargate (Backend Containers)
    ↓
RDS MySQL (Database)
    ↓
ElastiCache Redis (Session/Cache) [선택]
```

### VPC 구성

```
VPC (10.0.0.0/16)
├── Public Subnet (10.0.1.0/24, 10.0.2.0/24)
│   ├── NAT Gateway
│   └── ALB
├── Private Subnet (10.0.10.0/24, 10.0.20.0/24)
│   └── ECS Tasks
└── Database Subnet (10.0.100.0/24, 10.0.200.0/24)
    └── RDS (Multi-AZ)
```

---

## 서비스별 설정

### ECS Fargate (Backend)

```json
// task-definition.json
{
  "family": "backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "${ECR_URI}:${IMAGE_TAG}",
      "portMappings": [
        { "containerPort": 8080, "protocol": "tcp" }
      ],
      "environment": [
        { "name": "SPRING_PROFILES_ACTIVE", "value": "prod" }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/backend",
          "awslogs-region": "ap-northeast-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### RDS MySQL

```hcl
# Terraform
resource "aws_db_instance" "main" {
  identifier     = "learning-platform-db"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"  # 프리티어

  allocated_storage     = 20
  max_allocated_storage = 100  # 자동 확장

  db_name  = "learning_db"
  username = "admin"
  password = var.db_password  # Secrets Manager에서

  multi_az               = true  # 운영환경
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  skip_final_snapshot     = false

  tags = local.common_tags
}
```

### S3 + CloudFront (Frontend)

```hcl
resource "aws_s3_bucket" "frontend" {
  bucket = "learning-platform-frontend"
}

resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-frontend"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-frontend"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  # SPA 라우팅
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}
```

---

## 태깅 전략

```hcl
locals {
  common_tags = {
    Project     = "LearningPlatform"
    Environment = var.environment  # dev/staging/prod
    ManagedBy   = "Terraform"
    Owner       = "backend-team"
  }
}
```

---

## 비밀 관리

### Secrets Manager 사용

```bash
# 비밀 생성
aws secretsmanager create-secret \
  --name "prod/learning-platform/db" \
  --secret-string '{"username":"admin","password":"xxx"}'
```

### 애플리케이션에서 사용

```yaml
# Spring Boot application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:3306/learning_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

# ECS Task Definition에서 Secrets Manager 참조
```

---

## CI/CD 파이프라인

### GitHub Actions → ECR → ECS

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/backend:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/backend:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster learning-platform \
            --service backend \
            --force-new-deployment
```

---

## 비용 최적화

| 서비스 | 프리티어/최적화 |
|--------|----------------|
| EC2/ECS | Fargate Spot (70% 절감) |
| RDS | db.t3.micro (프리티어) |
| S3 | Intelligent-Tiering |
| CloudFront | 캐시 최적화 |
| NAT Gateway | 비용 주의 (시간당 과금) |

---

## 체크리스트

### 배포 전
- [ ] VPC, 서브넷 구성 확인
- [ ] Security Group 최소 권한
- [ ] Secrets Manager에 비밀값 저장
- [ ] IAM Role 권한 확인

### 배포 후
- [ ] Health Check 정상
- [ ] CloudWatch 로그 확인
- [ ] 비용 알림 설정
- [ ] 백업 정책 확인

---

> 상세 아키텍처 → [infrastructure.md](../docs/context/infrastructure.md)
