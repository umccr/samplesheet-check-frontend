#!/usr/bin/env source
# -*- coding: utf-8 -*-
# This wrapper script is mainly for local development purpose only.
#
# Sourcing this script will perform:
#   1. get required config values from SSM Parameter Store
#   2. export them as REACT_x environment variables
#
# REQUIRED CLI:
# aws, jq
#
# USAGE:
#
# Otherwise source it standalone itself by:
#     source start.sh
#     source start.sh unset
#
# CAVEATS:
# If your Portal Django backend is not running on :8000, then before start
# you can override by, e.g.  export DATA_PORTAL_API_URL=localhost:5000
#
# Try to be POSIX-y. Only tested on macOS! Contrib welcome for other OSs.

if [ "$(ps -p $$ -ocomm=)" = 'zsh' ] || [ "${BASH_SOURCE[0]}" -ef "$0" ]
then
    ps -p $$ -oargs=
    echo "YOU SHOULD SOURCE THIS SCRIPT, NOT EXECUTE IT!"
    exit 1
fi

command -v aws >/dev/null 2>&1 || {
  echo >&2 "AWS CLI COMMAND NOT FOUND. ABORTING..."
  return 1
}

command -v jq >/dev/null 2>&1 || {
  echo >&2 "JQ COMMAND NOT FOUND. ABORTING..."
  return 1
}

if [ -n "$1" ] && [ "$1" = "unset" ]; then
  unset REACT_APP_API_URL
  unset REACT_APP_STAGE
  unset REACT_APP_REGION
  unset REACT_APP_COG_USER_POOL_ID
  unset REACT_APP_COG_IDENTITY_POOL_ID
  unset REACT_APP_COG_APP_CLIENT_ID_LOCAL
  unset REACT_APP_COG_APP_CLIENT_ID_STAGE
  unset REACT_APP_OAUTH_DOMAIN
  unset REACT_APP_OAUTH_REDIRECT_IN_LOCAL
  unset REACT_APP_OAUTH_REDIRECT_OUT_LOCAL
  unset REACT_APP_OAUTH_REDIRECT_IN_STAGE
  unset REACT_APP_OAUTH_REDIRECT_OUT_STAGE
  echo "UNSET REACT ENV VAR"
  return 0
fi

# Some parameter is taken from data-portal-client
# Reference: https://github.com/umccr/data-portal-client
cog_user_pool_id=$(aws ssm get-parameter --name '/data_portal/client/cog_user_pool_id' | jq -r .Parameter.Value)
if [[ "$cog_user_pool_id" == "" ]]; then
  echo "Halt, No valid AWS login session found. Please 'aws sso login --profile dev && export AWS_PROFILE=dev'"
  return 1
fi
cog_identity_pool_id=$(aws ssm get-parameter --name '/data_portal/client/cog_identity_pool_id' | jq -r .Parameter.Value)
cog_app_client_id_local=$(aws ssm get-parameter --name '/data_portal/client/cog_app_client_id_local' | jq -r .Parameter.Value)
cog_app_client_id_stage=$(aws ssm get-parameter --name '/sscheck/client/cog_app_client_id_stage' | jq -r .Parameter.Value)

oauth_domain=$(aws ssm get-parameter --name '/data_portal/client/oauth_domain' | jq -r .Parameter.Value)
oauth_redirect_in_local=$(aws ssm get-parameter --name '/data_portal/client/oauth_redirect_in_local' | jq -r .Parameter.Value)
oauth_redirect_out_local=$(aws ssm get-parameter --name '/data_portal/client/oauth_redirect_out_local' | jq -r .Parameter.Value)
oauth_redirect_in_stage=$(aws ssm get-parameter --name '/sscheck/client/oauth_redirect_in_stage' | jq -r .Parameter.Value)
oauth_redirect_out_stage=$(aws ssm get-parameter --name '/sscheck/client/oauth_redirect_out_stage' | jq -r .Parameter.Value)

api_url=$(aws ssm get-parameter --name '/sscheck/lambda-api' | jq -r .Parameter.Value)

export REACT_APP_API_URL=$api_url
export REACT_APP_STAGE=dev
export REACT_APP_REGION=ap-southeast-2

export REACT_APP_COG_USER_POOL_ID=$cog_user_pool_id
export REACT_APP_COG_IDENTITY_POOL_ID=$cog_identity_pool_id
export REACT_APP_COG_APP_CLIENT_ID_LOCAL=$cog_app_client_id_local
export REACT_APP_COG_APP_CLIENT_ID_STAGE=$cog_app_client_id_stage

export REACT_APP_OAUTH_DOMAIN=$oauth_domain
export REACT_APP_OAUTH_REDIRECT_IN_LOCAL=$oauth_redirect_in_local
export REACT_APP_OAUTH_REDIRECT_OUT_LOCAL=$oauth_redirect_out_local
export REACT_APP_OAUTH_REDIRECT_IN_STAGE=$oauth_redirect_in_stage
export REACT_APP_OAUTH_REDIRECT_OUT_STAGE=$oauth_redirect_out_stage
env | grep REACT

