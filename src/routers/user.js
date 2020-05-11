const express = require('express')
const multer = require('multer')
const userUtil = require('./user-util')
const auth = require('../middleware/auth')
const router = express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image in jpg, jpeg, or png format'))
        }

        cb(undefined, true)
    }
})

router.post('/users', userUtil.addUser)
router.get('/users/me', auth, userUtil.getUsers)
router.patch('/users/me', auth, userUtil.updateUser)
router.delete('/users/me', auth, userUtil.deleteUser)
router.post('/users/login', userUtil.loginUser)
router.post('/users/logout', auth, userUtil.logoutUser)
router.post('/users/logoutAll', auth, userUtil.logoutAllUsers)
router.post('/users/me/avatar', auth, upload.single('avatar'), userUtil.uploadAvatar, userUtil.uploadError)
router.delete('/users/me/avatar', auth, userUtil.deleteAvatar, userUtil.uploadError)
router.get('/users/:id/avatar', userUtil.getAvatar)

module.exports = router