const net = require('net');
const utils = require('./utils');
const _ = require('lodash');

const scanner = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Server in which clients connect to communicate with one another.
 * This server broadcasts all standard messages it receives to all other
 * clients currently connected to the server.
 * 
 * This server also broadcasts "event" messages, such as anyone joining or leaving
 * the chat room, going AFK, and changing of one's nickname.
 * @class Server
 */
class Server {

    /**
     * Creates an instance of Server and sets necessary event listeners.
     * @param {Number} MAX_NUM_CONNECTIONS The max number of connections allowed to a chat room
     * @memberof Server
     */
    constructor(MAX_NUM_CONNECTIONS) {
        this.sockets = [];  // All the clients connected to the server.
        this.MAX_NUM_CONNECTIONS = MAX_NUM_CONNECTIONS; // The max number of connections allowed
        this.numConnections = 0; // The current number of connections to the server.

        // Creates the server and listens for any incoming connections
        net.createServer((s) => {
            // Room capacity meet
            if (this.numConnections >= this.MAX_NUM_CONNECTIONS) {
                s.end("Room at capacity");
            }
            else {
                // Sets up a socket object with event listeners and adds it to the current connections
                let clientObj = {
                    socket: s,
                    id: ++this.numConnections,
                    nickname: 'PLACEHOLDER',
                    isAFK: false
                };
                this.setSocketEvents(clientObj);
                this.sockets.push(clientObj);
            }
        })
        .on('error', (error) => {
            console.error(error.message);
        })
        .listen(8080, () => {
            console.log('Listening on port 8080');
        });
    }

    /**
     * This sets up the standard socket events to listen for, based on the net library.
     * @param {ClientObject} clientObj 
     * @memberof Server
     */
    setSocketEvents(clientObj) {
        const self = this;

        // Listens for any data that it receives
        clientObj.socket.on('data', (data) => {
            if (data.length > 0) {
                // Checks if the message is a slash command
                let message = utils.getCommand(data.toString());
                if (message) {
                    self.processCommand(clientObj, message.command, message.argument);
                }
                else {
                    message = data.toString();
                    message = utils.formatMessage(clientObj.nickname, message);
                    self.broadcast(clientObj.id, message);
                    console.log(message);
                }
            }
        });

        // When a socket disconnects from the server
        clientObj.socket.on('end', (socket) => {

            // Since this checks for disconnects of any kind
            // A special case is in place for automatically
            // disconnecting sockets when the room is at capacity.
            if (self.numConnections <= self.MAX_NUM_CONNECTIONS) {
                let timeStamp = utils.getTimestamp();
                let message = `${timeStamp} ${clientObj.nickname} left the room`;

                self.removeSocket(clientObj);
                console.log(message);
                self.broadcast(clientObj.id, message);
            }
        });
    }

    /**
     * Gets the current users in the room
     * @param {ClientObj} client Client that currently is checking the users in the room
     * @returns String that contains the current users in the room.
     * @memberof Server
     */
    getUsersInRoom(client) {
        let message;
        // Checks if there are any other clients in the room.
        if (this.sockets.length > 1) {
            message = "Users in the room: "; 
            this.sockets.forEach(c => {
                if (!_.isEqual(client, c)) {
                    message += `${c.nickname}, `;
                }
            });
            message = message.slice(0, message.length - 2);
        }
        else {
            message = `You're the only user in the room. Invite your friends!`;
        }
        return message;
    }

    /**
     * Parses commands and does the appropriate action based on the command.
     * @param {ClientObject} clientObj The client object sending the command.
     * @param {String} command The command being sent.
     * @param {String} argument The argument for the command, which is optional.
     * @memberof Server
     */
    processCommand(clientObj, command, argument) {
        let broadcastMessage;
        let userMessage;
        let timeStamp = utils.getTimestamp();
        switch (command) {
            case utils.COMMANDS.nick:
                // We use PLACEHOLDER as the first name to determine whether or not
                // a client is connecting for the first time or not.
                if (clientObj.nickname !== 'PLACEHOLDER') {
                    broadcastMessage = `${timeStamp} ${clientObj.nickname} changed their nickname to ${argument}`;
                }
                else {
                    userMessage = this.getUsersInRoom(clientObj);
                    broadcastMessage = `${timeStamp} ${argument} joined the room`;
                }
                clientObj.nickname = argument;
                break;
            case utils.COMMANDS.afk:
                clientObj.isAFK = !clientObj.isAFK;
                broadcastMessage = clientObj.isAFK ? `${clientObj.nickname} went AFK` :
                                                     `${clientObj.nickname} is back!`;
                broadcastMessage = utils.formatEventMessage(broadcastMessage);
                userMessage = clientObj.isAFK ? `You have gone AFK. Type /afk to receive messages again` :
                                                `You are not AFK anymore. Type /afk to go AFK again`;
                break;
            case utils.COMMANDS.exit:
                this.removeSocket(clientObj);
                clientObj.socket.end(); 
            default:
                broadcastMessage = utils.formatMessage(clientObj.nickname, `/${command} ${argument}`);
        }

        if (broadcastMessage)
            this.broadcast(clientObj.id, broadcastMessage);

        if (userMessage)
            clientObj.socket.write(userMessage);

        console.log(broadcastMessage);
    }
    /**
     * Broadcasts the message given to all other clients connected.
     * 
     * @param {any} senderId The Id of the user sending the message
     * @param {any} message The message being sent to all other clients
     * @memberof Server
     */
    broadcast(senderId, message) {

        if (this.sockets.length === 0) {
            console.log(`${utils.getTimestamp()} No users in the chat`);
            return; 
        }

        // Doesn't broadcast a message to a client if they are AFK or they are the 
        // the client in question. 
        this.sockets.forEach((client) => {
            if (client.id === senderId || client.isAFK) return;
            client.socket.write(message);
        });
    }

    /**
     * Removes the socket from the current connections list.
     * @param {any} socket 
     * @memberof Server
     */
    removeSocket(socket) {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
        this.numConnections--;
    }
}

/**
 * Starts the server after getting the room capacity for the chat room.
 */
function main() {
    process.stdout.write('Please enter the room capacity\n> ');
    scanner.on('line', (capacity) => {
        let size = Number.parseInt(capacity);

        if (isNaN(size)) {
            process.stdout.write('Please enter a valid integer\n> ');
        }
        else {
            scanner.close();
            process.stdin.destroy();
            new Server(size);
        }
    });
}

main();

