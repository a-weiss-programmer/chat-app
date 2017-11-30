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
    });
    
    
    client.on('connect', () => {
        client.write(`/nick ${myNick}`);
    });

    client.on('end', (err) => {
        console.log('Disconnected from server');
        process.exit();
    });

    client.on('data', function (data) {
        data = data.toString();
        console.log(data);
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
        }
        else {
            myNick = line;
            startClient();
        }
    } else {
        const date = new Date();
        const currentTime = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
        client.write(`${currentTime} ${myNick}: ${line}`);
    }
});

getNick();