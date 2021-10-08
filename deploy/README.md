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

# The Setup

The `cdk.json` file tells the CDK Toolkit how to execute your app.

This project is set up like a standard Python project.  The initialization
process also creates a virtualenv within this project, stored under the `.venv`
directory.  To create the virtualenv it assumes that there is a `python3`
(or `python` for Windows) executable in your path with access to the `venv`
package. If for any reason the automatic creation of the virtualenv fails,
you can create the virtualenv manually.

To manually create a virtualenv on MacOS and Linux:

```
$ python3 -m venv .venv
```

After the init process completes and the virtualenv is created, you can use the following
step to activate your virtualenv.

```
$ source .venv/bin/activate
```

If you are a Windows platform, you would activate the virtualenv like this:

```
% .venv\Scripts\activate.bat
```

Once the virtualenv is activated, you can install the required dependencies.

```
$ pip install -r requirements.txt
```


# CDK pipeline deploy

When the pipeline deployed, changes to this repository will automatically deployed on the infrastructure.
Initial deployment of the pipeline is required to setup the pipeline.

`cdk deploy CdkPipeline --profile dev`
