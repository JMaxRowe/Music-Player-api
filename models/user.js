import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: ['Please provide a username.', true], 
        unique: true
    },
    email: { 
        type: String, 
        required: ['Please provide an email.', true], 
        unique: true 
    },
    password: { 
        type: String, 
        required: ['Please provide a password.', true] 
    }
},{
    toJSON: { 
        virtuals: true, 
        transform: (doc, objectToBeReturned) => { 
        delete objectToBeReturned.password
        delete objectToBeReturned.id
        }
    }
})

userSchema.virtual('createdMovies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'author'
})

userSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, 12)
    }
    next()
})

const User = mongoose.model('User', userSchema)

export default User