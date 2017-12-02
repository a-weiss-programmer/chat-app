const net = require('net');
const utils = require('./utils');
const _ = require('lodash');

const scanner = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class Server {
    constructor(MAX_NUM_CONNECTIONS) {
        this.sockets = [];
        this.MAX_NUM_CONNECTIONS = MAX_NUM_CONNECTIONS;
        this.numConnections = 0;

        net.createServer((s) => {
            // Room capacity meet
            if (this.numConnections >= this.MAX_NUM_CONNECTIONS) {
                s.end("Room at capacity");
            }
            else {
                let socketObj = {
                    socket: s,
                    id: ++this.numConnections,
                    nickname: 'PLACEHOLDER',
                    isAFK: false
                };
                this.setSocketEvents(socketObj);
                this.sockets.push(socketObj);
            }
            
        })
        .on('error', (error) => {
            console.error(error.message);
        })
        .listen(8080, () => {
            console.log('Listening on port 8080');
        });
    }



    setSocketEvents(socketObj) {
        const self = this;

        socketObj.socket.on('data', (data) => {
            if (data.length > 0) {
                let message = utils.getCommand(data.toString());

                if (message) {
                    self.processCommand(socketObj, message.command, message.argument);
                }
                else {
                    message = data.toString();
                    message = utils.formatMessage(socketObj.nickname, message);
                    self.broadcast(socketObj.id, message);
                    console.log(message);
                }
            }
        });


        // When client leaves
        socketObj.socket.on('end', (socket) => {
            
            // Since this checks for disconnects of any kind
            // A special case is in place for automatically
            // disconnecting sockets when the room is at capacity.
            if (self.numConnections <= self.MAX_NUM_CONNECTIONS) {
                let timeStamp = utils.getTimestamp();
                let message = `${timeStamp} ${socketObj.nickname} left the room`;

                self.removeSocket(socketObj);

                console.log(message);

                self.broadcast(socketObj.id, message);
            }
        });

    }

    getUsersInRoom(client) {
        let message;
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

    processCommand(socketObj, command, argument) {
        let broadcastMessage;
        let userMessage;
        let timeStamp = utils.getTimestamp();
        switch (command) {
            case utils.COMMANDS.nick:
                if (socketObj.nickname !== 'PLACEHOLDER') {
                    broadcastMessage = `${timeStamp} ${socketObj.nickname} changed their nickname to ${argument}`;
                }
                else {
                    userMessage = this.getUsersInRoom(socketObj);
                    broadcastMessage = `${timeStamp} ${argument} joined the room`;
                }
                socketObj.nickname = argument;
                break;
            case utils.COMMANDS.afk:
                socketObj.isAFK = !socketObj.isAFK;
                broadcastMessage = socketObj.isAFK ? `${socketObj.nickname} went AFK` :
                                                     `${socketObj.nickname} is back!`;
                broadcastMessage = utils.formatEventMessage(broadcastMessage);
                userMessage = socketObj.isAFK ? `You have gone AFK. Type /afk to receive messages again` :
                                                `You are not AFK anymore. Type /afk to go AFK again`;
                break;
            default:
                broadcastMessage = utils.formatMessage(socketObj.nickname, `/${command} ${argument}`);
        }

        this.broadcast(socketObj.id, broadcastMessage);

        if (userMessage)
            socketObj.socket.write(userMessage);

        console.log(broadcastMessage);
    }
    broadcast(senderId, message) {
        if (this.sockets.length === 0) {
            console.log(`${utils.getTimestamp()} No users in the chat`);
            return; 
        }

        this.sockets.forEach((client) => {
            if (client.id === senderId || client.isAFK) return;
            client.socket.write(message);
        });
    }

    // Remove disconnected client from sockets array
    removeSocket(socket) {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
        this.numConnections--;
    }
}

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

