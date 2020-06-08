/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */
require('dotenv').config()

module.exports = {
    port: process.env.SERVER_PORT,
    app: process.env.APP,
    env: process.env.NODE_ENV,
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket:process.env.AWS_BUCKET,
        region:process.env.AWS_REGION,
        basicPath: process.env.BASIC_UPLOAD_PATH
    }
}
