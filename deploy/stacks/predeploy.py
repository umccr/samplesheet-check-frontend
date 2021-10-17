from aws_cdk import (
    core as cdk,
    aws_ssm as ssm,
)

class PredeploymentStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str,constants=None, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create SSM Paramter for bucket name
        ssm.StringParameter(self, "bucketName",
            allowed_pattern=".*",
            description="The Bucket Name for the React code to live",
            parameter_name="/sscheck/bucket_name",
            string_value="sscheck-front-end-code-dev", # Potsfix might changed according to stage
            tier=ssm.ParameterTier.STANDARD
        )
