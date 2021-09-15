# samplesheet-check-frontend

This is the front end code for UMCCR samplesheet check.

The directories:
- *deploy* - It will contain the AWS cdk cloud infrastructrure. [CDK readme](deploy/README.md)
- *public* - Contains static files.
- *src* - The react source code.


### To Run Locally

**React**
1. Install React dependancy  
        `npm i`
2. Fetch ENV variables from AWS Systems Manager Parameter Store. (This will store environment variable needed to the terminal)  
        `source get_env.sh`
3. Start the project and will be running at *http://localhost:3000/*  
        `npm start`
