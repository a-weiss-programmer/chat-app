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
            process.exit(0);
        });

        this.client.on('data', (data) => {
            let msg = data.toString();
            if (msg.indexOf('/exit') != -1) {
                let nickname = msg.split(' ')[1];
                nickname = nickname.substring(0, nickname.length - 1);
                utils.consoleOut(scanner, utils.formatEventMessage(`${nickname} has left the room`));
            }
            else {
                utils.consoleOut(scanner, msg.toString());
            }
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
        else if (line.length > 0) {
            let sendMessage = true;
            // Magic line to make it so the chat response doesn't show up twice to the sending client
            readline.moveCursor(process.stdout, 0, -1);
            if (!utils.isCommand(line)) {
                utils.consoleOut(scanner, utils.formatMessage(client.myNick, line));
            }
            else {
                let possibleCommand = utils.getCommand(line);

                if (!Object.keys(utils.COMMANDS).includes(possibleCommand.command)) {
                    utils.consoleOut(scanner, utils.formatMessage(client.myNick, line));
                }
                else {
                    switch (possibleCommand.command) {
                        case utils.COMMANDS.help:
                            utils.displayHelpMessage(scanner);
                            sendMessage = false;
                            process.stdout.cursorTo(0);
                            scanner.prompt(true);
                            break;
                        case utils.COMMANDS.nick:
                            client.myNick = possibleCommand.argument;
                            utils.consoleOut(scanner, `You changed your nickname to ${client.myNick}`);
                            scanner.prompt(true);
                            break;
                    }
                    process.stdout.clearLine();
                }
            }
            if (sendMessage)
                client.send(`${line}`);
        }
        else {
            readline.moveCursor(process.stdout, 0, -1);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            scanner.prompt(true);
        }
    });
    getNick();
}

main();
