const config = require("./config/config")
const express = require("express")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const cors = require("cors")
const router = require("./router/router")
const helmet = require('helmet')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))
app.use(helmet())
app.use("/api/",router)

app.listen(config.port,() => {
 console.log(`${config.app} App run in PORT:${config.port}`)
})
