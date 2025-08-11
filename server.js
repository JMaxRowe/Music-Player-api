import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import mongoose from 'mongoose'


import userRouter from './controllers/users.js'
import movieRouter from './controllers/movies.js'

import notFoundHandler from './middleware/notFoundHandler.js'
import errorHandler from './middleware/errorHandler.js'
import verifyToken from './middleware/verifyToken.js'

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(morgan('dev'))

app.get('/protected-route', verifyToken, (req, res, next) => {
    return res.json({ message: 'HIT PROTECTED ROUTE' })
})

app.use('/api/auth', userRouter)
app.use('/api/movies', movieRouter)

app.use(notFoundHandler)

app.use(errorHandler)

const startServers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🔒 Database connected')
        app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
startServers()