const net = require('net');
const readline = require('readline');
const host = process.argv[2] || 'localhost';
const port = process.argv[3] || 8080;

let client = null;
let myNick = null;

function startClient() {
    client = net.connect({ 
        port: port, 
        host: host, 
    }, () => {
        client.write(`${myNick} joined the room.`);
    });

    client.on('data', function (data) {
        data = data.toString();
        console.log(data);
    });

    client.on('end', function () {
        console.log('Server has disconnected.');
        process.exit();
    });
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
            startClient();
        }
    } else {
        let date = new Date();
        let currentTime = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
        client.write(`${currentTime} ${myNick}: ${line}`);
    }
});

getNick();