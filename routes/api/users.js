const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')

const validationRegisterInput = require('../../validation/register')
const validationLoginInput = require('../../validation/login')

const User = require('../../models/User')

// @route POST api/users/register
// @desc Register user
// @access Public

router.post('/register', async(req, res) => {
    const { errors, isValid } = validationRegisterInput(req.body)
    const { name, email, password } = req.body;

    if (!isValid) return res.status(400).json(errors)

    let emailExist = await User.findOne({ email })
    if (emailExist) return res.status(400).json({ email: 'email already exist' })

    const newUser = new User({
        name,
        email,
        password
    })

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt)

    try {
        await newUser.save()
        res.send({ newUser: newUser._id })
    } catch (error) {
        res.status(400).send('server error')
    }
})



// @route POST api/users/login
// @desc Register user
// @access Public


router.post('/login', async(req, res) => {
    const { errors, isValid } = validationLoginInput(req.body)
    const { email, password } = req.body;

    if (!isValid) return res.status(400).json(errors)

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ emailNotFound: 'email not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
        const payload = {
            id: user.id,
            name: user.name
        }

        jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 }, (err, token) => {
            res.json({
                success: true,
                token: "Bearer " + token
            })
        })
    } else {
        return res.status(400).json({ passwordincorrect: 'Password Incorrect' })
    }
})


module.exports = router