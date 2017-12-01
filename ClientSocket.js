const net = require('net');
const readline = require('readline');
const utils = require('./utils');

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
            utils.consoleOut(scanner, 'Welcome to the "IRC" chat room!');
            self.send(`/nick ${this.myNick}`);
        });

        this.client.on('end', (err) => {
            utils.consoleOut(scanner, 'Disconnected from server');
            process.exit();
        });

        this.client.on('data', (data) => {
            utils.consoleOut(scanner, data.toString());
        });
    }

    send(msg) {
        this.client.write(`${msg}`);
    }
}

function getNick() {
    utils.consoleOut(scanner, "What's your name?");
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
            // Magic line to make it so the chat response doesn't show up twice to the sending client
            readline.moveCursor(process.stdout, 0, -1);
            utils.consoleOut(scanner, utils.formatMessage(client.myNick, line));
            client.send(`${line}`);
        }
    });
    getNick();
}

main();
