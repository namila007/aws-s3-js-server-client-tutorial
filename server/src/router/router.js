/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */
const express = require('express')
const router = express.Router()
const awsController = require("../controllers/awsS3Controller")

router.get("/status", (req,res) => {
    res.status(200).send({status:"OK"})
})

/**
 * file {
 *     filename:<string>, 
 *     contentType:<MIME type>, 
 *     contentMd5: <The base64-encoded 128-bit MD5 digest of the message > 
 *  }
 */
router.put("/upload",  awsController.putObject)

/**
 * /itemlist = return max of 5 items
 * /itemlist/?ContinuationToken=<URLENCODED NextContinuationToken> for iterate
 * 
 */
router.get("/itemlist",  awsController.getObjectList)
/**
 * /item/?KEY=<URLENCODED KEY>
 */
router.get("/item", awsController.getObjectByKey)

module.exports = router