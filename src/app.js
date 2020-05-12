const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async() => {
//     // const task = await Task.findById('5eb510a995e6d14828c91ecf')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     const user = await User.findById('5eb510205c96b64550108e43')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

module.exports = app