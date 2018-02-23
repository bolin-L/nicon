#!/bin/bash

# DB config

# mongodb
export MONGODB_NAME=iconRepo;
export MONGODB_HOST=127.0.0.1;
export MONGODB_PORT=27017;
export MONGODB_USERNAME='';
export MONGODB_PASSWORD='';


# redis
export REDIS_FAMILY=4;
export REDIS_HOST=127.0.0.1;
export REDIS_PORT=6379;
export REDIS_PASSWORD='';
export REDIS_DB=0;


# config your website host
export productHost='';


# if you want login by github and upload by qiniu, set productType
export productType='github_qiniu';


# Login config

# github openid login
export GITHUB_LOGIN_CLIENT_ID='';
export GITHUB_LOGIN_CLIENT_SECRET='';
export GITHUB_LOGIN_REDIRECT_URI='';



# Upload config

# qiniu
export QINIU_UPLOAD_ACCESS_KEY='';
export QINIU_UPLOAD_SECRET_KEY='';
export QINIU_UPLOAD_BUCKET='';
export QINIU_UPLOAD_CDN_HOST='';