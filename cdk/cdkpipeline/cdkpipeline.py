# importing modules
from aws_cdk import (
    aws_ssm as ssm,
    pipelines,
    core as cdk,
    aws_codepipeline as codepipeline,
    aws_codebuild as codebuild,
    aws_codepipeline_actions as codepipeline_actions,
    aws_iam as iam
)
from stack.sscheck import SampleSheetCheckFrontEndStack

class SampleSheetCheckStage(cdk.Stage):
    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create stack defined on stacks folder
        SampleSheetCheckFrontEndStack(self, "SampleSheetCheckFrontEnd")

# Class for the CDK pipeline stack
class CdkPipelineStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Load SSM parameter for GitHub repo (Created via Console)
        codestar_arn = ssm.StringParameter.from_string_parameter_attributes(self, "codestarArn",
            parameter_name="/sscheck/codestar-connection-arn"
        ).string_value

        cloud_artifact = codepipeline.Artifact(
            artifact_name="sscheck_pipeline_cloud"
        )

        source_artifact = codepipeline.Artifact(
            artifact_name="sscheck_pipeline_source",
        )

        # Fetch github repository for changes
        code_star_action = codepipeline_actions.CodeStarConnectionsSourceAction(
            connection_arn = codestar_arn,
            output = source_artifact,
            owner = "umccr",
            repo = "samplesheet-check-frontend",
            branch = "implement-pipeline",
            action_name = "Source"
        )

        # build_spec = codebuild.BuildSpec.from_source_filename("/cdk/buildspec.yml")

        # Create CDK pipeline
        pipeline = pipelines.CdkPipeline(
            self,
            "CDKPipeline",
            cloud_assembly_artifact = cloud_artifact,
            pipeline_name="CDKSampleSheetCheckFrontEnd",
            source_action = code_star_action,
            synth_action = pipelines.SimpleSynthAction(
                synth_command = "cdk synth",
                cloud_assembly_artifact = cloud_artifact,
                source_artifact = source_artifact,
                install_commands = [
                    "npm install -g aws-cdk",
                    "gem install cfn-nag",
                    "pip install -r requirements.txt"
                ],
                test_commands = [
                    "mkdir ./cfnnag_output",
                    "for template in $(find ./cdk.out -type f -maxdepth 2 -name '*.template.json'); do cp $template ./cfnnag_output; done",
                    "cfn_nag_scan --input-path ./cfnnag_output"
                ],
                action_name = "Synth",
                # build_spec = build_spec,
                project_name = "cdk_synth",
                subdirectory = "cdk"
            )

        )
            

        # Deploy infrastructure
        pipeline.add_application_stage(
            SampleSheetCheckStage(
                self,
                "SampleSheetCheckFrontEndStage",
            )
        )

        react_build_stage = pipeline.add_stage(
            stage_name="ReactBuild",
        )

        react_build_stage.add_actions(
            pipelines.ShellScriptAction(
                action_name = "BuildScript",
                commands = [
                    "echo $(ls)",
                    "cd react",
                    "echo $(ls)",
                    "aws --version",
                    "jq --version",
                    "aws ssm get-parameter --name '/data_portal/client/cog_app_client_id_local'"

                    # "npm run build",
                    # "npm run deploy"
                ],
                additional_artifacts = [source_artifact],
                role_policy_statements = [
                    iam.PolicyStatement(
                        actions=["ssm:GetParameter"],
                        effect=iam.Effect.ALLOW,
                        resources=["arn:aws:ssm:ap-southeast-2:843407916570:parameter/sscheck"]
                    )
                ]
            )
        )