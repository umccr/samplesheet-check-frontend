#!/usr/bin/env python3
import os

from aws_cdk import App

# Import cdk pipeline stack
from stacks.pipeline_stack import PipelineStack

# Account environment and region
account_id = os.environ.get('CDK_DEFAULT_ACCOUNT')
aws_region = os.environ.get('CDK_DEFAULT_REGION')

# Determine account stage (Identify if it is running on prod or dev)
if account_id == "472057503814":  # Account number used for production environment
    app_stage = "prod"
else:
    app_stage = "dev"


props = {
    "app_stack_name": "sscheck-front-end-stack",
    "pipeline_artifact_bucket_name" :{
        "dev": "sscheck-front-end-artifact-dev",
        "stg": "sscheck-front-end-artifact-stg",
        "prod": "sscheck-front-end-artifact-prod"
    },
    "client_bucket_name": {
        "dev": "org.umccr.dev.sscheck",
        "stg": "org.umccr.stg.sscheck",
        "prod": "org.umccr.prod.sscheck"
    },
    "branch_source": {
        "dev": "dev",
        "stg": "feat/55-stg-deployment",
        "prod": "main"
    },
    "alias_domain_name":{
        "dev": ["sscheck.dev.umccr.org"],
        "stg": ["sscheck.stg.umccr.org"],
        "prod": ["sscheck.umccr.org", "sscheck.prod.umccr.org"]
    }
}

app = App(
    context={
        "app_stage": app_stage,
        "props": props
    }
)

PipelineStack(
  app,
  "SSCheckFrontEndPipeline",
  stack_name = "sscheck-front-end-pipeline",
  tags={
    "stage": app_stage,
    "stack":"sscheck-front-end-pipeline"
  }
)

app.synth()
