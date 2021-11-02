#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

# Import cdk pipeline stack
from stacks.pipeline_stack import PipelineStack
from stacks.predeployment_stack import PredeploymentStack

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
    "pipeline_artifact_bucket_name" :{
        "dev": "data-portal-status-page-artifact-dev",
        "prod": "data-portal-status-page-artifact-prod"
    },
    "client_bucket_name": {
        "dev": "org.umccr.dev.data.sscheck",
        "prod": "org.umccr.prod.data.sscheck"
    },
    "repository_source": "umccr/samplesheet-check-frontend",
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

PipelineStack(
  app,
  "SSCheckFrontEndPipeline",
  stack_name = "cdkpipeline-sscheck-front-end",
  tags={
    "stage": app_stage,
    "stack":"cdkpipeline-sscheck-front-end"
  }
)

""" 
The Predeployment stack are meant to be run once, before the pipeline stack is deployed.
Failure to do so may result in a stack rollback on the pipeline stack.
NOTE: Please Validate SSL Certificate from predeployment stack thorugh console. (for prod account)
"""
PredeploymentStack(
    app,
    "SScheckPredeploymentStack",
    stack_name="sscheck-front-end-predeployment",
    tags={
        "stage": app_stage,
        "stack": "sscheck-front-end-predeployment"
    }
)

app.synth()
