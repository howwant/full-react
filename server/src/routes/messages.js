import { readDB, writeDB } from "../dbController.js"

const messagesRoute = [
    { //GET MESSAGES
        method:'get',
        route: '/messages',
        handler: (req,res) => {
            const msgs = readDB('messages')
            res.send(msgs)
        },
    },
    { //CREATE MESSAGES 10의 8분
        method:'post',
        route: '/messages',
        handler: (req,res) => {
            res.send()
        },
    },
    { //UPDATE MESSAGES
        method:'put',
        route: '/messages/:id',
        handler: (req,res) => {
            res.send()
        },
    },
    { //DELETE MESSAGES
        method:'delete',
        route: '/messages/:id',
        handler: (req,res) => {
            res.send()
        },
    },
]

export default messagesRoute;