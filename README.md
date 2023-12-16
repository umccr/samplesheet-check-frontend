# samplesheet-check-frontend

This is the frontend code for UMCCR samplesheet check.

The directories:
- *deploy* - It will contain the AWS cdk cloud infrastructrure. 
- *public* - Contains static files.
- *src* - The react source code.

**AWS-CDK Infrastructure**

See CDK readme at deploy directory. [CDK readme](deploy/README.md)

**React**
1. Install React dependancy  
        `npm i`
2. Fetch ENV variables from AWS Systems Manager Parameter Store. (This will store environment variable needed to the terminal)  
        `source get_env.sh`
3. Start the project and will be running at *http://localhost:3000/*  
        `npm start`
