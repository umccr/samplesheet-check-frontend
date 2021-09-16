#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

from cdkpipeline.cdkpipeline import CdkPipelineStack

account_id = os.environ.get('CDK_DEFAULT_ACCOUNT')
aws_region = os.environ.get('CDK_DEFAULT_REGION')
aws_env = {'account': account_id , 'region': aws_region}

 
app = cdk.App()

CdkPipelineStack(
  app,
  "SampleSheetFrontEndCdkPipeline",
  stack_name = "cdkpipeline-sscheck-front-end-dev",
  env=aws_env,
  tags={
    "environment":"dev",
    "stack":"cdkpipeline-sscheck-front-end-dev"
  }
)

app.synth()
