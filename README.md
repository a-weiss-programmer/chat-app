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
1. Enter the maximum amount of chat clients allowed.
1. You're now good to begin running clients!

### Starting the client

1. To start the client application: `/node ClientSocket.js`
1. Enter your nickname
1. Begin chatting!

## __Bugs__

1. **Commands: /nick and /help**: There is an issue that once a client types in either `/nick` and `/help`, they will need to hit enter (return carriage) one more time. This is due to the chat submission implementation that begins with the `>` arrow, and how the last command submitted it overwritten with a timestamp, nickname, and chat message.

    * Help command `/help`
    * Blank line.
    * Hit enter to dispaly arrow `>`
    * User types message: `> hello`
    * Processed message: `[23:59:59] Erik: hello`

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

* `/nick [arg]`
* Replace [arg] with your new nickname.
* Broadcasts change to chat.