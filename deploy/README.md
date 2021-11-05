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

It is recomended to create a virtual environment for the app.

To do so please follow the instruction below.

Change your directory to the root of this readme file.
```
$ cd deploy
```
Create a virtual environment for the app.
```
$ python3 -m venv .venv
```

After the init process completes and the virtualenv is created, you can use the following
step to activate your virtualenv.

```
$ source .venv/bin/activate
```

If you are a Windows platform, you might try this:

```
% .venv\Scripts\activate.bat
```
Once the virtualenv is activated, you can install the required dependencies.

```
$ pip install -r requirements.txt
```


# Stack Deployment

**Prerequisite**
- A valid SSL Certificate in `us-east-1` region at ACM for all the domain name needed. See [here](app.py#L39) (`alias_domain_name` on the props variable) on what domain need to be included, determined based on which account is deployed.
- SSM Parameter for the certificate ARN created above with the name of `/sscheck/ssl_certificate_arn`

_Deploying the stack without prerequisite above may result in a stack rollback._

There are 2 stacks in this application:
- *sscheck_front_end* - Contains the applications stack
- *pipeline* - Contains the pipeline for the stack to run and self update

To deploy the application stack, you will need to deploy the `pipeline` stack. The pipeline stack will take care of the `sscheck_front_end` stack deployment.

Deploy pipeline stack
```
$ cdk deploy SSCheckFrontEndCdkPipeline --profile={AWS_PROFILE}
```
