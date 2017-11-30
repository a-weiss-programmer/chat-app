const net = require('net');

class Server {
    constructor() {
        this.sockets = [];
        this.numConnections = 0;

        net.createServer((s) => {
            let socketObj = {
                socket: ,
                id: ++this.numConnections
            };
            this.setSocketEvents(socketObj);
            this.sockets.push(socketObj);
        })
        .on('error', (error) => {
            console.error(error.message);
        })
        .listen(8080, () => {
            console.log('Listening on port 8080');
        });
    }

    setSocketEvents(socketObj) {
        var self = this;
        socketObj.socket.on('data', function (data) {

            var message = data.toString();

            self.broadcast(socketObj.id, message);

            // Log it to the server output
            console.log(message);
        });


        // When client leaves
        socketObj.socket.on('end', function () {

            // Remove client from socket array
            self.removeSocket(socket);

            // Notify all clients
            this.broadcast(socketObj.id, "Someone left the server!");
        });
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
        sockets.splice(sockets.indexOf(socket), 1);
    }
}

new Server();
