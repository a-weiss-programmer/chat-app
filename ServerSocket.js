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

    setSocketEvents(socketObj) {
        const self = this;

        socketObj.socket.on('data', function (data) {
            const message = data.toString();

            if (message[0] == '/' && message.length > 1) {
                let command = message.match(/[a-z]+\b/)[0];
                let argument = message.substr(command.length+2, message.length);
                self.processCommand(socketObj, command, argument);
            }
            else {
                self.broadcast(socketObj.id, message);
                // Log it to the server output
                console.log(message);
            }
        });


        // When client leaves
        socketObj.socket.on('end', function (socket) {
            
            // Since this checks for general disconnects
            // A special case is in place for reaching 
            // The max number of connections
            if (self.size < self.MAX_NUM_CONNECTIONS) {
                // Remove client from socket array
                self.removeSocket(socket);

                // Notify all clients
                self.broadcast(socketObj.id, "Someone left the server!");
            }
            
        });
    }
    processCommand(socketObj, command, argument) {
        switch (command) {
            case 'nick':
                if (socketObj.nickname !== 'PLACEHOLDER') {
                    this.broadcast(socketObj.id, `${socketObj.nickname} changed their nickname to ${argument}`);
                }
                else {
                    this.broadcast(socketObj.id,  `${argument} joined the room`);
                }
                console.log(`${utils.getTimestamp()} ${argument} joined the room`);
                socketObj.nickname = argument;
                break;
            // TODO: ADD MORE COMMANDS
            default:
                break;
        }
    }
    broadcast(senderId, message) {
        if (this.sockets.length === 0) {
            console.log('No users in the chat');
            return; 
        }

        this.sockets.forEach((socket) => {
            if (socket.id === senderId) return;
            socket.socket.write(message);
        });
    }

    // Remove disconnected client from sockets array
    removeSocket(socket) {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
    }
}

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


