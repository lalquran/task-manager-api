const express = require('express')
const taskUtil = require('./task-util')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/tasks', auth, taskUtil.addTask)
router.get('/tasks', auth, taskUtil.getTasks)
router.get('/tasks/:id', auth, taskUtil.getTask)
router.patch('/tasks/:id', auth, taskUtil.updateTask)
router.delete('/tasks/:id', auth, taskUtil.deleteTask)

module.exports = router