# samplesheet-check-frontend

This is the front end code that will develop on the samplesheet validation form.

The directories are divided into two:
- *cdk* - It will contain the AWS cdk where the react code will be hosted
- *react* - The react code itself

### To Deploy all resource

1. setup the aws infrastructure useing the command. [From root directory]  
    `cd cdk && source .venv/bin/activate && cdk deploy`

2. Deploying react code to the aws infrastructure. [From the root directoy]  
    `cd react && source fetch_react_env.sh && npm run deploy`

### To Run Locally

**React**
1. Change directory to react folder  
        `cd react`
2. Install React dependancy  
        `npm i`
3. Fetch ENV variables from AWS Systems Manager Parameter Store. (This will store environment variable needed to the terminal)  
        `source fetch_react_env.sh`
4. Set **REACT_APP_STAGE** environment to *localhost* (will set project to run locally).  
        This use Linux, macOS (Bash) terminal command. [Look here for different terminal](https://create-react-app.dev/docs/adding-custom-environment-variables#adding-temporary-environment-variables-in-your-shell)  
        `REACT_APP_STAGE=localhost`
3. Start the project and will be running at *http://localhost:3000/*  
        `npm start`

