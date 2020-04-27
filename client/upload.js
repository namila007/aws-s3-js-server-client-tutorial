const axios = require("axios")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

/**
 *
 * @param {*} filePath = video file path
 * @param {*} orderId = auctionOrder id
 * 
 */
async function handleUpload (filePath) {
    const fileSystemPath = path.join(filePath)
    const fileName = path.basename(fileSystemPath)
    const filebuff = fileBuffer(fileSystemPath)
    const md5hash = fileHash(filebuff)

    const generatedUploadURL = await getUploadURLObject(md5hash, fileName)
    console.log(generatedUploadURL)
    const signedURL =  generatedUploadURL.data.url
    let res = await uploadFile(filebuff, md5hash, signedURL)
    return handleResponse(res)
}

/**
 *
 * @param {*} filebuff
 * @param {*} md5hash
 * @param {*} uploadURL
 * @param {*} cb
 * {"Content-MD5": md5hash } header is required when uploading
 */
function uploadFile (filebuff, md5hash, uploadURL) {
    console.log("saving online")
    return axios.put(uploadURL, filebuff,
        { headers: { "Content-MD5": md5hash }})
        .then(function (res) {
            console.log("Saved online")
            return handleResponse(res, null)
        })
        .catch(handleErrors)
}

/**
 *
 * @param {*} md5hash
 * @param {*} fileName
 * @param {*} orderId
 */
async function getUploadURLObject (md5hash, fileName) {
    try {
        let data = {
            
            "name": fileName,
            "contentType": "video/webm",
            "contentMD5": md5hash
            
        }
        return axios.put("http://localhost:3030/api/upload", data)
            .then(respond => {
                if (respond.status === 200) {
                    return handleResponse(respond, null)
                } else {
                    console.log(respond)
                    handleResponse(respond, null)
                }
            }).catch(handleErrors)
    } catch (e) { handleErrors(e) }
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
    console.error(e)
    return handleResponse(null, e)
}

function handleResponse (respond, error) {
    // console.log(respond)
    return {
        status: respond ? respond.status : 0,
        data: respond ? respond.data : "",
        message: error ? error.message : ""
    }
}

module.exports = {
    handleUpload: handleUpload,
    fileHash: fileHash
}
