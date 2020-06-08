/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */

const axios = require("axios")
const fs = require("fs")
const path = require("path")

/**
 * 
 * @param {*} key Object key
 */
async function handleDownload (key) {
    
    try {
        // Defining filename n path
        let arr = key.split("/")
        const fileName = arr[arr.length-1]
        const savePath = path.join(__dirname,"..","downloads", fileName)

        let signedDLObject = await getDownloadURLObject(key)
        return Promise.resolve(downloadFiles(signedDLObject.url,savePath))
         
    }
    catch (error) {
        return Promise.reject(error)
    }

}

/**
 * 
 * @param {*} downloadUrl pre-signed url
 * @param {*} filePath saving path ie: abc/ab.jpg 
 */
function downloadFiles (downloadUrl, filePath) {
    console.log("Downloading Started")
    return axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'stream'
        })
        .then(function (res) {
            res.data.pipe(fs.createWriteStream(filePath))
            console.log("Downloaded")
            return true
        })
        .catch(e => {
            handleErrors(e.response.data)
        })
}

/**
 *
 * @param {*} key object key
 */
async function getDownloadURLObject (key) {
        let encodedKey = encodeURI(key)
        return axios.get(`http://localhost:3030/api/item/?KEY=${encodedKey}`)
            .then(respond => {
                if (respond.status === 202) {
                    return respond.data
                } else {
                    throw new Error(` Error Occured ${respond.data}`)
                }
            }).catch(e => {
                handleErrors(e.response.data)
            })
}



/**
 *
 * @param {*} e error
 */
function handleErrors (e) {
    throw new Error (e.message || e )
}

module.exports = {
    handleDownload: handleDownload
}
