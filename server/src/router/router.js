const express = require('express')
const router = express.Router()
const uploadController = require("../controllers/uploadController")
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
router.put("/upload", async (req, res) => {
    const fileObj = req.body.file
    const respond = await uploadController.presignedUploadurl(fileObj)
    res.status(200).json({res: respond})
})

module.exports = router