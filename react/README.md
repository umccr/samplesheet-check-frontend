# UMCCR Frontend Samplesheet Check 

This is a react framework for the Samplesheet check website

### Fetch ENV file from AWS Systems Manager Parameter Store
Ensure AWS CLI is connected with the correct AWS account.  
To fetch all the environment needed for the REACT_APP:  
`source fetch_react_env.sh`

### Deploy React code

Build run a build command and copy the code to aws resource  
`npm run deploy`

### Run react locally

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
