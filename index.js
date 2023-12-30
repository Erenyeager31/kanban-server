const connectToMonngo = require('./db')
connectToMonngo();

require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser')

const app = express()

//? configuring the websocket
const webSocket = require('ws')
const http = require('http')
const server = http.createServer(app)
const ws = new webSocket.Server({ server })

//* maintaining the list of users who have joined the connection
let users = []

//? creation of function for the websocket

const message = {
    "JOIN": "join",
    "LEAVE": "leave",
    "UPDATE": "update",
}

// const category = {
//     "TASKS": 'tasks',
//     "UNDERWORK": 'underwork',
//     "COMPLETED": 'completed',
//     "TESTING": 'testing',
//     "DEPLOYED": 'deployed',
// }

function broadcast(received_data) {
    if (received_data.type == message.JOIN) {
        // console.log(received_data)
        const { email, username } = received_data.user_data
        let flag = false;
        //*validation to check if the user alreday does not exist
        for (let i in users){
            console.log(users[i])
            if(users[i].email == email){
                flag = true
                break
            }
        }
        if(!flag){
            users.push({
                username,email
            })
            const response_message = {
                'type': message.JOIN,
                'message': `${username} has joined the Workspace`,
                'user_data': users
            }
            ws.clients.forEach((client) => {
                if (client.readyState === webSocket.OPEN) {
                    client.send(JSON.stringify(response_message))
                }
            })
            return username
        }
    }
    else if (received_data.type == message.LEAVE) {
        console.log("hi")
        const { email, username } = received_data.user_data
        delete users[username]
        const response_message = {
            'type': message.LEAVE,
            'message': `${username} has left the Workspace`,
            'user_data': users
        }
        ws.clients.forEach((client) => {
            console.log(client)
            if (client.readyState === webSocket.OPEN) {
                client.send(JSON.stringify(response_message))
            }
        })
    }
    else if (received_data.type == message.UPDATE) {
        // in this case received_data will contain --> 1.type,2.user_data = {email,username},3.category[]- a list
        const { email, username, category } = received_data.user_data
        console.log("Message received")
        const response_message = {
            'type': message.UPDATE,
            'message': `${username} updated certain data in the Workspace`,
            'category': category //* the client will check the length, if 1 then only fetch single data else fetch 2 columns/containers
        }
        ws.clients.forEach((client) => {
            if (client.readyState === webSocket.OPEN) {
                client.send(JSON.stringify(response_message))
            }
        })
    }else{
        console.log("Unexpected message type")
    }
}

ws.on('connection', (ws) => {
    console.log('Client connected')

    //* as soon as a connection is open on the client side, it sends a message to the websocket
    //* the message will be of type join and it will send its name and email,
    //* this will be added to the 'user list'

    let username = ""
    ws.on('message', (data) => {
        const received_data = JSON.parse(data)
        username = broadcast(received_data)
    })

    //* for the case when connection is closed abruptly, as the 'type' of LEAVE cannot be executed
    ws.on('close',(code,reason) =>{
        for(let i in users){
            if(users[i].username == username){
                users.splice(i,1)
            }
        }
        console.log(users)
        console.log(code,reason,`${username} client disconnected...`)
    });
})

const port = process.env.PORT || 5000
const host = "http://localhost:5000"
const cors = require('cors')
app.use(cookieParser())

app.use(cors({
    origin: ["https://kanbanboard-b18z.onrender.com","https://kanban-board-31.web.app"],
    credentials: true
}))

app.use(express.json())

//! defining the routes

//? API route to be taken when performing Login or SignUp operations
// app.use('/api/Auth',require('./Routes/auth'))
// app.use('/api/WS',require('./Routes/workspace'))

//auth
app.use('/api/Auth', require('./Routes/authentication'))
// ws
app.use('/api/WS', require('./Routes/workspace_2'))
// board Modification
app.use('/api/BM',require('./Routes/boardModification'))

//* instead of app using server.listen
// app.listen(port, ()=>{
//     console.log(`Server Listening on ${host}`)
// })

server.listen(port, () => {
    console.log(`Server Listening on ${host}`)
})
