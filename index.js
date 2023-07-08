const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const {connect} = require('./config/db-config');
const  Group  = require('./models/group');
const Chat = require('./models/chat');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

io.on('connection', (socket) => {
    console.log("A client connected...", socket.id);

    socket.on('disconnect', () => {
        console.log("Client disconected id...");
    });

    socket.on('new_msg', async (data) => {
        console.log(data);
        await Chat.create({
            roomId: data.roomId,
            sender: data.sender,
            content: data.message
        })
        io.to(data.roomId).emit('msg_recvd', data);
    })

    socket.on('join_room', (data) => {
        console.log("Room Joined Id ", data.roomId);
        socket.join(data.roomId);
    });
});

app.get("/chat/:roomId/:user", async(req, res) => {
    const groupName = await Group.findById(req.params.roomId);
    const chats = await Chat.find({
        roomId: req.params.roomId
    })

    res.render('index', {
        name: "Omkar",
        roomId: req.params.roomId,
        user: req.params.user,
        groupName: groupName.name,
        chatHistory: chats
    });
});

app.get('/group', async (req, res) => {
    res.render('group');
});

app.post('/group', async (req, res) => {
    console.log(req.body);
    await Group.create({
        name: req.body.name
    });
    res.redirect('/group');
})

server.listen(4000, async () => {
    await connect();
    console.log("Server running also...");
})