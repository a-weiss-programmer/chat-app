const net = require('net');
const readline = require('readline');
const utils = require('./utils');

const HOST = 'localhost';
const PORT = 8080;

const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Client that connects to the server. Uses the readline module and
 * uses some "console" magic to make it seem more like an IRC chat client
 * @class ClientSocket
 */
class ClientSocket {
    constructor(myNick) {
        this.myNick = myNick;
        this.client = net.connect({ 
            port: PORT,
            host: HOST
        });
        this.setClientEventListeners();
    }

    /**
     * Sets the event listeners of the client based on the net library
     * @memberof ClientSocket
     */
    setClientEventListeners() {
        const self = this;

        // Displays a welcome message and sets the server's nickname to the one specified.
        this.client.on('connect', () => {
            utils.consoleOut(scanner, 'Welcome to the "IRC" chat room!');
            self.send(`/nick ${this.myNick}`);
        });

        // Disconnects the client from the server and ends the program
        this.client.on('end', (err) => {
            utils.consoleOut(scanner, 'Disconnected from server');
            process.exit(0);
        });

        // Checks for any data sent back from the server
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

    /**
     * Sends a message on the client to the server
     * 
     * @param {String} msg The message being sent to the server.
     * @memberof ClientSocket
     */
    send(msg) {
        this.client.write(`${msg}`);
    }
}

/**
 * Sets the prompt for setting the nickname
 */
function getNick() {
    utils.consoleOut(scanner, "What's your name?");
}

/**
 * Gets the nickname for the client and initiates a connection with the server.
 * It takes user input and sends the line to the server.
 */
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
                    if (possibleCommand.command === 'nick') {
                        client.myNick = possibleCommand.argument;
                        utils.consoleOut(scanner, `You changed your nickname to ${client.myNick}`);
                        scanner.prompt(true);
                    }
                    process.stdout.clearLine();
                }
            }
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
