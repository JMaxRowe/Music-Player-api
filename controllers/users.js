import express from 'express'
import User from '../models/user.js'
import { InvalidData, Unauthorized } from '../utils/errors.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/tokens.js'

const router = express.Router()

router.post('/sign-up', async (req, res, next) =>{
    try {
        if (req.body.password !== req.body.passwordConfirmation) {
            throw new InvalidData('Passwords do not match.', 'password')
    }

    const newUser = await User.create(req.body)

    const token = generateToken(newUser)
    return res.status(201).json({ token: token })
    } catch (error) {
        next(error)
    }

})

router.post('/sign-in', async (req, res, next) =>{
    const {identifier, password} = req.body
    try {
        const foundUser = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        })
        if(!foundUser){
            throw new Unauthorized('User does not exist.')

        }
        if (!bcrypt.compareSync(password, foundUser.password)) {
            throw new Unauthorized('Passwords do not match.')
        }
        const token = generateToken(foundUser)
        return res.json({ token: token })
    } catch (error) {
        next(error)
    }
})

export default router