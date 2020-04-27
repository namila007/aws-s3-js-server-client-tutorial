const express = require('express')
const router = express.Router()
const awsController = require("../controllers/awsS3Controller")
const config = require("../config/config")

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
router.put("/upload",  awsController.presignedUploadurl)

/**
 * /getlist = return max of 5 items
 * /getlist/?ContinuationToken=<NextContinuationToken> for iterate
 * 
 */
router.get("/getlist",  awsController.getObjectList)

router.get("/item", awsController.getItemByKey)

module.exports = router