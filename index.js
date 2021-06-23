import secret  from './secret.js'
import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = 3000

app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

mongoose.connect(secret, {useNewUrlParser: true, useUnifiedTopology: true})
const Robot = mongoose.model('Robot', { name: String })

app.get('/test', (req, res) => {
    const robot = new Robot({ name: 'Zildjian' })
    robot.save()

    res.json(robot)
}) 

// Elegant way to get data
app.post('/robots', async (req, res) => {
    let robots = null
    if (req.body.ids.length > 0) { 
        robots = await Robot.find({ _id: { $in: req.body.ids } } ).exec()
    } else {    
        robots = await Robot.find({})
    }
    res.json(robots)
})

/* CRUD: Robot */ 
app.get('/robot/:id', async (req, res) => {
    const robot = await Robot.findById(req.params.id)
    res.json({success: true, robot})
})

app.delete('/robot/:id', async (req, res) => {
    await Robot.deleteOne({_id: req.params.id})
    res.json({success: true})
})

app.post('/robot', (req, res) => {
    const robot = new Robot({ name: req.body.name })
    robot.save()
    res.json({success: true, robot})
})

app.put('/robot', async (req, res) => {
    const robot = await Robot.findById(req.body.id)
    robot.name = req.body.newData.name
    robot.save()
    res.json({success: true, robot})
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})