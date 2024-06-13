# samplesheet-check-frontend

This is the frontend code for UMCCR samplesheet check.

The directories:
- *deploy* - It will contain the AWS cdk cloud infrastructrure. 
- *public* - Contains static files.
- *src* - The react source code.

**AWS-CDK Infrastructure**

See CDK readme at deploy directory. [CDK readme](deploy/README.md)

**Run locally**

1. Install React dependency  
        `yarn install`
2. Set AWS Profile that has permission to get SSM Parameter variables
        `export AWS_PROFILE=dev`
3. Run the script that sets variable from SSM Parameter
        `source get_env.sh`
4. Start the project and will be running at *http://localhost:3000/*  
        `yarn start`
