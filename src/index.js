const app = require('./app')
const port = process.env.PORT 

app.listen(port, () => {
    console.log('Server running on port: ', port)
})

// const main = async() => {
//     // const task = await Task.findById('5eb510a995e6d14828c91ecf')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     const user = await User.findById('5eb510205c96b64550108e43')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()