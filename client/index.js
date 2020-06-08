/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */
const uploadClient = require("./lib/upload")
const downloadClient = require("./lib/download")
const path = require("path")

const fileName = "team-386673_1920.jpg"
const filePath = path.resolve(__dirname,fileName)
const contentType = "image/jpg"
try {

    uploadClient.handleUpload(filePath, contentType)
    .then( res => {
        console.log("Saving Completed",res)})
    .then(() => { return downloadClient.handleDownload("aws-s3-tutorial/"+ fileName)})
    .then((res) => console.log(res))
    .finally(()=> console.log("MISSION ACCOMPLISH :-)"))
    .catch(error => console.log(error.message))
    }
    catch(error) {
        console.log(error)
    }