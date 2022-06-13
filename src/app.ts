import dotenv from 'dotenv'
dotenv.config()
import express, {Express} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import router from './router'
import errorMiddleware from './middleware/error-middleware'

const PORT = process.env.PORT || 8000
const app: Express = express()

app.enable('trust proxy')
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
app.use('/api', router)
app.use(errorMiddleware)
// app.set('trust proxy', true)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL ?? '', {
      dbName: process.env.DB_NAME,
    })
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`)
    })
  } catch (e) {
      console.log(e)
  }
}

start().then()
