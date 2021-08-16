#!/usr/bin/env python3
import os

from aws_cdk import core as cdk

from cdk.cdk_stack import CdkStack


app = cdk.App()
CdkStack(app, "CdkStack")

app.synth()
