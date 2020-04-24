const s3 = require("../services/awsS3")
const config = require("../config/config")
const expireTime = 60 * 60 //1Hour 

const presignedUploadurl = async (fileObject) => {
    const key = config.aws.basicPath +fileObject.name
    let params = {
        Bucket: config.aws.bucket,
        Key: key,
        ContentType: fileObject.contentType,
        ContentMD5: fileObject.contentMD5,
        ACL: "public-read",
        Expires: expireTime
    }
    let sigendUrl = await s3.getSignedUrlPromise('putObject', params)
    let respond = {
        key: key,
        url: sigendUrl,
        expires: expireTime
    }
    return respond
}



module.exports = {
    presignedUploadurl: presignedUploadurl
}