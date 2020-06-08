/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */

const axios = require("axios")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

/**
 *
 * @param {*} filePath = saving path with file name
 * @param {*} contentType = content type
 * 
 */
async function handleUpload (filePath, contentType) {
    try {
        const fileSystemPath = path.join(filePath)
        const fileName = path.basename(fileSystemPath)
        const filebuff = fileBuffer(fileSystemPath)
        const md5hash = fileHash(filebuff)

        const generatedUploadURL = await getUploadURLObject(md5hash, fileName, contentType)
        const signedURL =  generatedUploadURL.url
        const res = uploadFile(filebuff, md5hash, signedURL, contentType)
        return Promise.resolve(res)
    }
    catch (error) {
        return Promise.reject(error)
    }
}

/**
 *
 * @param {*} filebuff - file buffer
 * @param {*} md5hash - raw md5 hash
 * @param {*} uploadURL - presigned url
 * @param {*} contentType
 * {"Content-MD5": md5hash } header is required when uploading
 */
function uploadFile (filebuff, md5hash, uploadURL, contentType) {
    console.log("Saving online")
    return axios.put(uploadURL, filebuff,
        { headers: { "Content-MD5": md5hash , "Content-Type": contentType}})
        .then(function (res) {
            console.log("Saved online")
            return res.status
        })
        .catch(e => {
            handleErrors(e.response.data)
        })
}

/**
 *
 * @param {*} md5hash
 * @param {*} fileName
 * @param {*} orderId
 */
async function getUploadURLObject (md5hash, fileName, contentType) {
        let data = {
            "name": fileName,
            "contentType": contentType,
            "contentMD5": md5hash
        }
        return axios.put("http://localhost:3030/api/upload", data)
            .then(respond => {
                if (respond.status === 200) {
                    return respond.data
                } else {
                    throw new Error(`Error Occurred ${respond.data}`)
                }
            }).catch(e => {
                handleErrors(e.response.data)
            })
}

/**
 *
 * @param {*} file
 */
function fileBuffer (file) {
    let data = fs.readFileSync(file)
    return Buffer.from(data, "binary")
}
/**
 *
 * @param {*} filebuffer
 * @returns {raw base64 value}
 */
function fileHash (filebuffer) {
    return crypto.createHash("md5").update(filebuffer).digest("base64")
}
/**
 *
 * @param {*} e error
 */
function handleErrors (e) {
    throw new Error (e.message || e )
}


module.exports = {
    handleUpload: handleUpload,
    fileHash: fileHash
}
