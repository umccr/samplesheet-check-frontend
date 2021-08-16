# samplesheet-check-frontend

This is the front end code that will develop on the samplesheet validation form.

The directories are divided into two:
- *cdk* - It will contain the AWS cdk where the react code will be hosted
- *react* - The react code itself

### To run

1. setup the aws infrastructure useing the command  
`cd cdk && source .venv/bin/activate && cdk deploy`

2. Deploying react code to the aws infrastructure
  1. Go to the react folder and install the depndency
      `cd react && npm install`
  2. At the react folder deploy it to the aws resources
      `npm run deploy`

