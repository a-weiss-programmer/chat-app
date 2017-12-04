
# __Node Chat App__ (CSCI-3550)

Casey Largent, Kevin Nicklen, and Erik Shafer

## __Project Objective__

"Develop a simple chat client in the language of your choice." - *Gregory Gelfond (2017)*

## __High-Level Overview__

Using the **NodeJS** JavaScript runtime, we developed a chatroom reminiscent of an Internet Relay Chat (*IRC*) application. The chat process works on a *client/server networking model*. Clients are required to obtain the `ClientSocket.js` application, as it comes pre-configured to connect to the `ServerSocket.js` application.

## __Getting Started__

### Dependencies

* **NodeJS**: Node is a runtime environment for JavaScript. It must be downloaded (`https://nodejs.org/en/`, latest stable is `8.9.1`) to run the application.

### Starting the server
1. To start the server application: `/node ServerSocket.js` 
2. Enter the maximum amount of chat clients allowed.
3. You're now good to begin running clients!

### Starting the client
1. To start the client application: `/node ClientSocket.js`
2. Enter your nickname
3. Begin chatting!

## __Bugs__
1. **Return Carriage**: There is currently a cross-compatability issue with Macintosh (Unix) and Windows when submitting to chat. Macs currently distort the timestamp brackets slightly.

## __Features__

* **Entering the Server**
    * Users already connected are displayed in a list for the newly connected client. If no one is connected, the client is encouraged to invite friends.

* **Help Command**
    * `/help`
    * Brings up commands to help users understand the client application better.

* **Away From Keyboard**
    * `/afk`
    * Inbound messages are not shown to the client. A notification for going or coming back from *AFK* is broadcasted to the server.

* **Exiting the Server**
    * `/exit` Properly exits the server.
    * Broadcasts across chat.

* **Changing Nickname**
    * `/nick _____`
    * Replace underlines with your new nickname.
    * Broadcasts change to chat.