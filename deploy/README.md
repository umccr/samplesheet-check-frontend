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

There are 3 stacks in this application:
- *sscheck_front_end* - Contains the applications stack
- *pipeline* - Contains the pipeline for the stack to run and self update
- *predeployment* - Contains predeployment resource that is needed for other stacks.

_*Predeployment stack must be deployed before any other stack to avoid stack rollback_

To deploy the application stack. You will just need to deploy 2 stacks which are `predeployment` and `pipeline` stack. The pipeline stack will take care of the `sscheck_front_end` stack deployment.

_*After the predeployment stack is deployed. SSL certificate must be validated before proceeding to pipeline stack_

Instruction on deployment (**must** be in order):

Deploy predeployment stack
```
$ cdk deploy SScheckPredeploymentStack --profile=dev
```

Validate SSL certificate through the console before proceeding.

Deploy pipeline stack
```
$ cdk deploy SSCheckFrontEndCdkPipeline --profile=dev
```

