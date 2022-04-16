//установка модулей
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const router = require('./routers/Router')
const errorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const fileUpload = require('express-fileupload')

//создание объекта app для работы с express
const app = express()
const PORT = process.env.PORT || 5000
//установка промежуточного ПО
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandlingMiddleware)
//запуск сервера
const start = async ()=>{
    try {
        await mongoose.connect(
            process.env.DB_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

        app.listen(PORT, ()=>{
            console.log(`сервер запущен на порте ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)
    }
}

start()