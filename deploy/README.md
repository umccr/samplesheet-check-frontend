# UMCCR client CDK for Samplesheet Check

This cdk will build an AWS cloud infrastructure for the UMCCR samplesheet check.

The directories:
- *cdkpipeline* - Contain the stack for the pipeline.
- *stacks* - Contains the samplesheet frontend check.

## Resources

- **AWS cloudfront**  
    Access s3 bucket react code
- **AWS S3 bucket**  
    Store react build code
- **Route 53**  
    Setup DNS for the samplesheet check for cloudfront

# Setting up
It is recommended to create a virtual environment for the app.

To do so please follow the instructions below.

Change your directory to the root of this readme file.

```sh
cd deploy
```

Create a virtual environment for the app.

```sh
virtualenv .venv --python=python3.11
```


After the init process completes and the virtualenv is created, you can use the following
step to activate your virtualenv.

```sh
source .venv/bin/activate
```

Once the virtualenv is activated, you can install the required dependencies.

```sh
pip install -r requirements.txt
```

# Stack Deployment

**Prerequisite**

- A valid SSL Certificate in `us-east-1` region at ACM for all the domain names needed. See [here](app.py#L39) (`alias_domain_name` on the props variable) on what domain needs to be included, determined based on which account is deployed.
- SSM Parameter for the certificate ARN created above with the name of `/sscheck/ssl_certificate_arn`

_Deploying the _stack without _the _prerequisite__ above may_ result in a stack rollback._

There are 2 stacks in this application:

- *SSCheckFrontEndPipeline/SampleSheetCheckFrontEndStage/SampleSheetCheckFrontEnd* - Contains the applications stack
- *SSCheckFrontEndPipeline* - Contains the pipeline for the stack to run and self-update

To deploy the application stack, you will need to deploy the `pipeline` stack. The pipeline stack will take care of the
deployment stack.

Deploy pipeline stack

```sh
yarn cdk deploy SSCheckFrontEndCdkPipeline --profile={AWS_PROFILE}
```
