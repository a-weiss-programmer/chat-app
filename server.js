const net = require('net');
const readline = require('readline');
const port = process.argv[2] || 5000;
let socket = null;
let myNick = null;

function startServer() {
    net.createServer((s) => {
        if (socket) return s.end("Sorry this chat is full");

        socket = s;
        socket.write("Welcome to the chat, I'm " + myNick);

        socket.on('data', (data) => {
            data = data.toString();
            console.log(data);
        });

        socket.on('end', () => {
            console.log('Client has disconnected');
            socket = null;
        });

    }).listen(port);

    console.log("Chat server running at port " + port);
}

function getNick() {
    console.log("What's your name?");
}

const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

scanner.on('line', function (line) {
    if (!myNick) {
        line = line.trim();
        if (line.length < 1) {
            getNick();
        } else {
            myNick = line;
            startServer();
        }
    } else {
        socket.write(myNick + ": " + line);
    }
});;

getNick();