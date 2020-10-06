const { response } = require('express')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))
// app.use(express.static('/public/css/videostyle.css' + '/public'));


// app.get('/', (req, res)=>{
//     res.send('test')
// })


app.get('/', (req,res)=> {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req,res)=>{
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})



const PORT = process.env.PORT || 3000;

// APP.LISTEN(PORT, ()=>{
//     console.log(`App listening at http://localhost:${port}`)
// }

server.listen(PORT)