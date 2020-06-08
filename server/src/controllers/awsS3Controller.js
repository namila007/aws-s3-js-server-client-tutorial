/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */
const s3 = require("../services/awsS3")
const config = require("../config/config")
const httpStatus = require('http-status-codes');

const expireTime = 60 * 60 //1Hour 

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const putObject = async (req, res, next) => {
    try {
        const fileObject = req.body
        if(!fileObject || !fileObject.hasOwnProperty('name') || !fileObject.hasOwnProperty('contentMD5') || !fileObject.hasOwnProperty('contentType')) 
        {
            throw new Error ("Missing values in File Object \n"+fileObject)
        }
        const key = config.aws.basicPath +fileObject.name
        let params = {
            Bucket: config.aws.bucket,
            Key: key,
            ContentType: fileObject.contentType,
            ContentMD5: fileObject.contentMD5,
            ACL: "public-read",
            Expires: expireTime
        }
        const signedUrl = await s3.getSignedUrlPromise('putObject', params)
        let respond = {
            key: key,
            url: signedUrl,
            expires: expireTime
        }
        res.status(httpStatus.OK).json(respond)
    } catch(error) {
        next(error)
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getObjectList = (req, res, next) => {
    let params = {
        Bucket: config.aws.bucket, /* required */
        Prefix: config.aws.basicPath,
        MaxKeys: 10
    }
    if(req.query.ContinuationToken) params.ContinuationToken = decodeURI(req.query.ContinuationToken)
    s3.listObjectsV2(params, (err, data) => {
        if(err) {
            next(err)
        }
        let response = {
            IsTruncated: data.IsTruncated,
            Contents: data.Contents
        }
        if(data.NextContinuationToken) response.NextContinuationToken = data.NextContinuationToken
        if(data.ContinuationToken) response.ContinuationToken = data.ContinuationToken
        
        res.status(httpStatus.OK).json(response)
      })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getObjectByKey = async (req, res, next) => {

    let key = decodeURI(req.query.KEY)
    // testing if the key contains basic 
    try {
        if(!key) {
            throw new Error("KEY REQUIRED")
        }
        if(!RegExp(`${config.aws.basicPath}/*`).test(key)) {
            throw new Error("INVALID KEY "+ key)
        }
        let params = {
            Bucket: config.aws.bucket, 
            Key: key,
            Expires: expireTime
        }
    
        const signedUrl= await s3.getSignedUrlPromise('getObject', params)
        let respond = {
            key: key,
            url: signedUrl,
            expires: expireTime
        }
        res.status(httpStatus.ACCEPTED).json(respond)
    }
    catch (error){
        next(error)
    }
}

module.exports = {
    putObject: putObject,
    getObjectList: getObjectList,
    getObjectByKey: getObjectByKey
}