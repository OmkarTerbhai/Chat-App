


// let btn = document.getElementById("btn");
// btn.addEventListener('click', ()=> {
//     socket.emit("from_client", "Hello from client");
// })
// socket.on('from_server', () => {
//     let div = document.getElementById("from_server");
//     let p = document.createElement("p");

//     p.textContent = "Received an event from the server";
//     div.appendChild(p);
    
// })


    console.log("Started Client...");
    var socket = io();
    socket.emit('join_room', {
        roomId: '<%= roomId %>'
    });
    let input = document.getElementById("chatbox");
    let msgList = document.getElementById("msgList");
    let send = document.getElementById("send");

    send.addEventListener('click', ()=> {
        let msg = input.value;
        socket.emit('new_msg', {
            message: msg
        })
    });

    socket.on('msg_recvd', (data)=> {
        let msg = document.createElement("li");
        msg.textContent = data;
        msgList.appendChild(msg);
    });