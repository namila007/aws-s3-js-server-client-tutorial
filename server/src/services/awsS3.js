/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */
const AWS = require('aws-sdk')
const config = require("../config/config")


AWS.config.update({
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
    },
    region:config.aws.region
})
const s3 = new AWS.S3()

module.exports = s3