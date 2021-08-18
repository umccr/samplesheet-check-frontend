# samplesheet-check-frontend

This is the front end code that will develop on the samplesheet validation form.

The directories are divided into two:
- *cdk* - It will contain the AWS cdk where the react code will be hosted
- *react* - The react code itself

### To Deploy all resource

1. setup the aws infrastructure useing the command  
`cd cdk && source .venv/bin/activate && cdk deploy`

2. Deploying react code to the aws infrastructure [from the root directoy]  
    `cd react && npm run deploy`

### To Run Locally

**React**
1. Change directory to react folder  
        `cd react`
2. Install React dependancy  
        `npm i`
3. Start the project and will be running at *http://localhost:3000/*  
        `npm start`

