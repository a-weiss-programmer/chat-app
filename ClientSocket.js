const net = require('net');
const readline = require('readline');
const HOST = 'localhost';
const PORT = 8080;

const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class ClientSocket {
    constructor(myNick) {
        this.myNick = myNick;
        this.client = net.connect({ 
            port: PORT,
            host: HOST
        });
        this.setClientEventListeners();
    }

    setClientEventListeners() {
        const self = this;
        this.client.on('connect', () => {
            self.send(`/nick ${this.myNick}`);
        });

        this.client.on('end', (err) => {
            console.log('Disconnected from server');
            process.exit();
        });

        this.client.on('data', (data) => {
            console.log(data.toString());
        });
    }

    send(msg) {
        this.client.write(`${msg}`);
    }
}

function getNick() {
    process.stdout.write("What's your name?\n> ");
}

function main() {
    let client;    
    scanner.on('line', (line) => {
        if (!client) {
            line = line.trim();
            if (line.length < 1) {
                getNick();
            }
            else {
                client = new ClientSocket(line);
            }
        }
        else {
            client.send(`${line}`);
        }
    });

    getNick();
}

main();
