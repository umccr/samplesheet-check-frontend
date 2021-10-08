#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

from pipelines.cdkpipeline import CdkPipelineStack


aws_env = {'account': "843407916570" , 'region': "ap-southeast-2"}

 
app = cdk.App()

CdkPipelineStack(
  app,
  "SampleSheetFrontEndCdkPipeline",
  stack_name = "cdkpipeline-sscheck-front-end",
  env=aws_env,
  const= aws_env,
  tags={
    "stack":"cdkpipeline-sscheck-front-end"
  }
)

app.synth()
