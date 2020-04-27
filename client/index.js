const uploadClient = require("./upload")

uploadClient.handleUpload("./team-386673_1920.jpg").then( res => {
    console.log(res)
})
