from aws_cdk import (core as cdk,   
                        aws_s3 as s3,
                        aws_cloudfront as cloudfront
                    )

class CdkStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Creating bucket for the build directory code
        samplesheet_client_bucket = s3.Bucket(self, "umccr-samplesheet-script", 
            bucket_name="umccr-script-cdk.com",
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

        # setup error pages
        error_page_configuration = cloudfront.CfnDistribution.CustomErrorResponseProperty(
            error_code = 403,
            error_caching_min_ttl  = 60,
            response_code = 200,
            response_page_path = "/index.html"
        )

        # create the web distribution
        cloudfront.CloudFrontWebDistribution(self, "cloud_front_name",
            origin_configs=[source_config],
            error_configurations = [error_page_configuration],
            viewer_protocol_policy = cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
            default_root_object = "index.html",
            price_class = cloudfront.PriceClass.PRICE_CLASS_ALL
        )