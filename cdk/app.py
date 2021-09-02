#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

from stack.sscheck import SampleSheetCheckFrontEndStack

account_id = os.environ.get('CDK_DEFAULT_ACCOUNT')
aws_region = os.environ.get('CDK_DEFAULT_REGION')
aws_env = {'account': account_id , 'region': aws_region}

constants = {
  "bucket_name" : "sscheck-front-end-code-dev",
  "app_domain" : "sscheck.dev.umccr.org"
}

app = cdk.App()

SampleSheetCheckFrontEndStack(
  app,
  "SampleSheetCheckFrontEnd",
  env=aws_env,
  constants=constants
)

app.synth()
