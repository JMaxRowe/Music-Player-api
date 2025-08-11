const logError = (err) => {
    console.log('-------------------')
    console.log('🚨 Error 🚨')
    console.log('-------------------')
    console.log('Name:', err.name)
    console.log('Status:', err.status)
    console.log('Message:', err.message)
    console.log('-------------------')
    console.log('Stack:')
    console.log(err.stack)
    console.log('-------------------')
    console.log('The above error occurred during the below request:')
}

const errorHandler = (err, req, res, next) => {

    if (err.name === 'NotFound'){
        return res.status(404).json({ message: err.message })
    }

    if (err.name === 'InvalidData'){
        return res.status(err.status).json(err.response)
    }
    
    if (err.name === 'ValidationError'){
        const response = {}
        for(const keyName in err.errors){
            response[keyName] = err.errors[keyName].properties.message
        }
        return res.status(400).json(response)
    }

    if (err.name === 'MongoServerError' && err.code === 11000){
        const [keyName, keyValue] = Object.entries(err.keyValue)[0]
        return res.status(400).json({
            [keyName]: `${keyName[0].toUpperCase() + keyName.slice(1)} "${keyValue}" already taken. Please try another.`
        })
    }

    if (err.name === 'Unauthorized' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if (err.name === 'Forbidden') {
        return res.status(403).json({ message: err.message })
    }

    if (err.name === 'Unauthorized' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Unauthorized' })
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({ message: 'Item not found' })
    }
    return res.status(500).json({ message: 'Internal Server Error' })
}

export default errorHandler