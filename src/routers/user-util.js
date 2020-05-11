const User = require('../models/user')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const sharp = require('sharp')

async function addUser (req, res) {
    const user = new User(req.body)
    try {
        await user.save() 
        const token = await user.generateAuthToken(user.email, user.password)
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })
    } 
    catch (e) {
        res.status(400).send(e)
    }
}

const getUsers = async (req, res) => {
    res.send(req.user)
}

const getUser = async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
}

const updateUser = async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const body = req.body
    const updates = Object.keys(body)
    const isValidOperation = updates.every( update =>  allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])

        await user.save()
        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
}

const deleteUser = async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

const loginUser = async (req, res) => {
    const body = req.body
    try {
        const user = await User.findByCredentials(body.email, body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
}

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
}

const logoutAllUsers = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
 }

 const uploadAvatar = async (req, res) => {
     const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
     req.user.avatar = buffer

     await req.user.save()
     res.send()
 }

 const deleteAvatar = async (req, res) => {
     req.user.avatar = undefined

     await req.user.save()
     res.send()
 }

 const getAvatar = async (req, res) => {
     try {
         const user = await User.findById(req.params.id)

         if (!user || !user.avatar) {
             throw new Error()
         }

         res.set('Content-Type', 'image/png')
         res.send(user.avatar)
     }
     catch (e) {
         res.status(404).send()
     }
 }

 const uploadError = (error, req, res, next) => {
    res.status(400).send({error: error.message})
}

module.exports = {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    logoutAllUsers,
    uploadAvatar,
    uploadError,
    deleteAvatar,
    getAvatar
}