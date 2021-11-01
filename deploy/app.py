#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

# Import cdk pipeline stack
from pipelines.cdkpipeline import CdkPipelineStack

# Account environment and region
account_id = os.environ.get('CDK_DEFAULT_ACCOUNT')
aws_region = os.environ.get('CDK_DEFAULT_REGION')

# Determine account stage (Identify if it is running on prod or dev)
if account_id == "472057503814":  # Account number used for production environment
    app_stage = "prod"
else:
    app_stage = "dev"


props = {
    "pipeline_name": {
        "dev": "sscheck-frontend",
        "prod": "sscheck-frontend"
    },
    "bucket_name": {
        "dev": "org.umccr.dev.data.sscheck",
        "prod": "org.umccr.prod.data.sscheck"
    },
    "repository_source": "samplesheet-check-frontend",
    "branch_source": {
        "dev": "dev",
        "prod": "main"
    },
    "alias_domain_name":{
        "dev": ["sscheck.dev.umccr.org"],
        "prod": ["sscheck.umccr.org", "sscheck.prod.umccr.org"]
    }
}

app = cdk.App(
    context={
        "app_stage": app_stage,
        "props": props
    }
)

CdkPipelineStack(
  app,
  "SSCheckFrontEndCdkPipeline",
  stack_name = "cdkpipeline-sscheck-front-end",
  tags={
    "stage": app_stage,
    "stack":"cdkpipeline-sscheck-front-end"
  }
)

app.synth()
