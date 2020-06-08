/*
 * Created on Mon Jun 08 2020
 * Authored by Namila Bandara
 * Copyright (c) 2020
 * https://github.com/namila007/aws-s3-js-tutorial
 */
const errorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(err.status? err.status: "500").json({error: err.message})
}

module.exports =  errorHandler