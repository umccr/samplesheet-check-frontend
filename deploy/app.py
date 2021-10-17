#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

from stacks.predeploy import PredeploymentStack
from pipelines.cdkpipeline import CdkPipelineStack

 
app = cdk.App()

CdkPipelineStack(
  app,
  "SampleSheetFrontEndCdkPipeline",
  stack_name = "cdkpipeline-sscheck-front-end",
  tags={
    "stack":"cdkpipeline-sscheck-front-end"
  }
)

PredeploymentStack(
  app,
  "PredeploymentStack",
  stack_name = "Predeployment-sscheck-front-end",
  tags={
    "stack":"cdkpipeline-sscheck-front-end"
  }
)

app.synth()
