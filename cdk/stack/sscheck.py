from aws_cdk import (
    core as cdk,   
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_ssm as ssm,
    aws_route53 as route53,
    aws_route53_targets as route53t,
    aws_certificatemanager as acm,
    aws_cognito as cognito
)

class SampleSheetCheckFrontEndStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Load SSM parameter for bucket name ( Created via Console)
        bucket_name = ssm.StringParameter.from_string_parameter_attributes(self, "bucketValue",
            parameter_name="/sscheck/bucket_name"
        ).string_value

        # --- Query deployment env specific config from SSM Parameter Store

        cert_apse2_arn = ssm.StringParameter.from_string_parameter_name(
            self,
            "SSLCertAPSE2ARN",
            string_parameter_name="/htsget/acm/apse2_arn",
        )

        cert_apse2 = acm.Certificate.from_certificate_arn(
            self,
            "SSLCertAPSE2",
            certificate_arn=cert_apse2_arn.string_value,
        )

        hosted_zone_id = ssm.StringParameter.from_string_parameter_name(
            self,
            "HostedZoneID",
            string_parameter_name="hosted_zone_id"
        ).string_value

        hosted_zone_name = ssm.StringParameter.from_string_parameter_name(
            self,
            "HostedZoneName",
            string_parameter_name="hosted_zone_name"
        ).string_value

        # Query domain_name config from SSM Parameter Store (Created via Conosle)
        domain_name = ssm.StringParameter.from_string_parameter_name(
            self,
            "DomainName",
            string_parameter_name="/sscheck/domain",
        ).string_value

        # --- Cognito parameters are from data portal terraform stack
        cog_user_pool_id = ssm.StringParameter.from_string_parameter_name(
            self,
            "CogUserPoolID",
            string_parameter_name="/data_portal/client/cog_user_pool_id",
        ).string_value

        cog_app_client_id_stage = ssm.StringParameter.from_string_parameter_name(
            self,
            "CogAppClientIDStage",
            string_parameter_name="/data_portal/client/cog_app_client_id_stage",
        ).string_value

        cog_app_client_id_local = ssm.StringParameter.from_string_parameter_name(
            self,
            "CogAppClientIDLocal",
            string_parameter_name="/data_portal/client/cog_app_client_id_local",
        ).string_value

        # Creating bucket for the build directory code
        samplesheet_client_bucket = s3.Bucket(self, "umccr-samplesheet-script", 
            bucket_name = bucket_name,
            auto_delete_objects = True,
            removal_policy = cdk.RemovalPolicy.DESTROY,
            website_index_document = "index.html",
            website_error_document = "index.html",
            block_public_access= s3.BlockPublicAccess.BLOCK_ALL
        )

        # Create the Origin Access Identity (OAI)
        cloudfront_oai = cloudfront.OriginAccessIdentity(self, 'umccr-script-oai',
            comment = "Created By CDK")
        
        # create s3 configuration details
        s3_origin_source = cloudfront.S3OriginConfig(
            s3_bucket_source = samplesheet_client_bucket,
            origin_access_identity = cloudfront_oai                                
        )

        # setup cloudfront config for s3
        source_config = cloudfront.SourceConfiguration(
            s3_origin_source = s3_origin_source,
            behaviors=[cloudfront.Behavior(is_default_behavior=True)]
        )

        # setup error pages redirection
        error_page_configuration = cloudfront.CfnDistribution.CustomErrorResponseProperty(
            error_code = 403,
            error_caching_min_ttl  = 60,
            response_code = 200,
            response_page_path = "/index.html"
        )

        # create the web distribution
        sscheck_cloudfront = cloudfront.CloudFrontWebDistribution(self, "cloud_front_name",
            origin_configs=[source_config],
            error_configurations = [error_page_configuration],
            viewer_protocol_policy = cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            default_root_object = "index.html",
            price_class = cloudfront.PriceClass.PRICE_CLASS_ALL,
            enable_ip_v6 = False,
            # viewer_certificate=cloudfront.ViewerCertificate.from_acm_certificate(cert_apse2)
        )

        
