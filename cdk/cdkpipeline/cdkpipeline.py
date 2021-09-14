# importing modules
from aws_cdk import (
    aws_ssm as ssm,
    pipelines,
    core as cdk,
    aws_codepipeline_actions as codepipeline_actions
)
from stack.sscheck import SampleSheetCheckFrontEndStack

class SampleSheetCheckStage(cdk.Stage):
    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create the Bucket Stack, which uses the bucket_stack.py to create a S3 bucket
        SampleSheetCheckFrontEndStack(self, "SampleSheetCheckFrontEnd")

# Class for the CDK pipeline stack
class CdkPipelineStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str,constant, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Load SSM parameter for GitHub repo (Created via Console)
        codestar_arn = ssm.StringParameter.from_string_parameter_attributes(self, "codestarArn",
            parameter_name="/sscheck/codestar-connection-arn"
        ).string_value

        # Fetch github repository for changes
        gh_repository = pipelines.CodePipelineSource.connection(
            repo_string="umccr/samplesheet-check-frontend",
            branch="implement-pipeline",
            connection_arn = codestar_arn
        )

        # Create CDK pipeline
        pipeline = pipelines.CodePipeline(
            self, "CDKPipeline",
            pipeline_name="CDKSampleSheetCheckFrontEnd",

            # Synthezise and check all templates within cdk.out directory with cfn_nag
            synth=pipelines.ShellStep("Synth",
                # Point source to codecommit repository
                input=gh_repository,

                # Actual commands used in the CodeBuild build.
                commands=[
                    "cd cdk",
                    "npm install -g aws-cdk",
                    "gem install cfn-nag",
                    "pip install -r requirements.txt",
                    "cdk synth",
                    "mkdir ./cfnnag_output",
                    "for template in $(find ./cdk.out -type f -maxdepth 2 -name '*.template.json'); do cp $template ./cfnnag_output; done",
                    "cfn_nag_scan --input-path ./cfnnag_output",
                    "echo $(ls)"
                ]
            )
        )

        # Deploy infrastructure
        pipeline.add_stage(
            SampleSheetCheckStage(
                self,
                "SampleSheetCheckFrontEndStage",
                env=constant
            )
        )