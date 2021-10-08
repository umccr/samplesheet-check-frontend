const REGION = process.env.REACT_APP_REGION;
const OAUTH_DOMAIN = `${process.env.REACT_APP_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

const LAMBDA_API = `https://${process.env.REACT_APP_LAMBDA_API_DOMAIN}`;

const config = {
  // endpoint for backend
  apiGateway: {
    REGION: REGION,
    URL: LAMBDA_API,
  },
  cognito: {
    REGION: REGION,
    USER_POOL_ID: process.env.REACT_APP_COG_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COG_APP_CLIENT_ID,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scope: ["email", "aws.cognito.signin.user.admin", "openid", "profile"],
      redirectSignIn: process.env.REACT_APP_OAUTH_REDIRECT_IN,
      redirectSignOut: process.env.REACT_APP_OAUTH_REDIRECT_OUT,
      responseType: "code",
    },
  },
};

export default config;
