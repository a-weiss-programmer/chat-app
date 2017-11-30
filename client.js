const net = require('net');
const readline = require('readline');
const host = process.argv[2] || 'localhost';
const port = process.argv[3] || 5000;

let client = null;
let myNick = null;

function startClient() {
    client = net.connect({ port: port, host: host }, () => {
        client.write("Hello, I'm " + myNick);
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
        client.write(myNick + ": " + line);
    }
});

getNick();