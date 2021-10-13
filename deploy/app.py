#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

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

app.synth()
