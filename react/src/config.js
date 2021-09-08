const STAGE = process.env.REACT_APP_STAGE;
const REGION = process.env.REACT_APP_REGION;
const IS_LOCAL = STAGE === "localhost";
const OAUTH_DOMAIN = `${process.env.REACT_APP_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

const LAMBDA_API = `https://${process.env.REACT_APP_LAMBDA_API_DOMAIN}`

const config = {
  // endpoint for backend
  apiGateway: {
    REGION: REGION,
    URL: LAMBDA_API,
  },
  cognito: {
    REGION: REGION,
    USER_POOL_ID: process.env.REACT_APP_COG_USER_POOL_ID,
    APP_CLIENT_ID: IS_LOCAL
      ? process.env.REACT_APP_COG_APP_CLIENT_ID_LOCAL
      : process.env.REACT_APP_COG_APP_CLIENT_ID_STAGE,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scope: ["email", "aws.cognito.signin.user.admin", "openid", "profile"],
      redirectSignIn: IS_LOCAL
        ? process.env.REACT_APP_OAUTH_REDIRECT_IN_LOCAL
        : process.env.REACT_APP_OAUTH_REDIRECT_IN_STAGE,
      redirectSignOut: IS_LOCAL
        ? process.env.REACT_APP_OAUTH_REDIRECT_OUT_LOCAL
        : process.env.REACT_APP_OAUTH_REDIRECT_OUT_STAGE,
      responseType: "code",
    },
  },
};

export default config;
