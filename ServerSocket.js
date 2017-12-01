const net = require('net');
const utils = require('./utils');
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
                    nickname: 'PLACEHOLDER'
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

    formatMessage(nickname, msg) {
        return `${utils.getTimestamp()} ${nickname}: ${msg}`;
    }

    setSocketEvents(socketObj) {
        const self = this;

        socketObj.socket.on('data', (data) => {
            let message = data.toString();

            if (message[0] == '/' && message.length > 1) {
                let command = message.match(/[a-z]+\b/)[0];
                let argument = message.substr(command.length+2, message.length);
                self.processCommand(socketObj, command, argument);
            }
            else {
                message = self.formatMessage(socketObj.nickname, message);
                self.broadcast(socketObj.id, message);
                // Log it to the server output
                console.log(message);
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
                // Remove client from socket array
                self.removeSocket(socketObj);

                // Notify all clients
                self.broadcast(socketObj.id, message);

                // Log messages
                console.log(message);
            }
        });

    }
    processCommand(socketObj, command, argument) {
        let message;
        let timeStamp = utils.getTimestamp();
        switch (command) {
            case 'nick':
                if (socketObj.nickname !== 'PLACEHOLDER') {
                    message = `${timeStamp} ${socketObj.nickname} changed their nickname to ${argument}`;
                }
                else {
                    message = `${timeStamp} ${argument} joined the room`;
                }
                
                this.broadcast(socketObj.id, message);
                console.log(`${message}`);
                socketObj.nickname = argument;
                break;
            // TODO: ADD MORE COMMANDS
            default:
                break;
        }
    }
    broadcast(senderId, message) {
        if (this.sockets.length === 0) {
            console.log(`${utils.getTimestamp()} No users in the chat`);
            return; 
        }

        this.sockets.forEach((client) => {
            if (client.id === senderId) return;
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

