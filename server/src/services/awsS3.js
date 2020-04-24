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