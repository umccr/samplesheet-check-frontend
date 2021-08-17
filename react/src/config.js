// TODO: Change the configuration for cognito
const config = {
  // endpoint for backend
  apiGateway: {
    REGION: "ap-southeast-2",
    URL: "https://thzxwdcebd.execute-api.ap-southeast-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "ap-southeast-2",
    USER_POOL_ID: "ap-southeast-2_3qo9bgZ83",
    APP_CLIENT_ID: "7lshj924ejcaindgukrjg80a42",
    IDENTITY_POOL_ID: "ap-southeast-2:0f4bd297-9e29-404f-813c-4b01f02e8e0b",
  },
};

export default config;