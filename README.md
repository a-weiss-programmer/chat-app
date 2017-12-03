
# Node Chat App

Casey Largent, Kevin Nicklen, and Erik Shafer

## Project Objective

"Develop a simple chat client in the language of your choice." - **Gregory Gelfond** (2017)

## High-Level Overview

Using the **NodeJS** JavaScript runtime, we developed a chatroom reminiscent of an Internet Relay Chat (*IRC*) application. The chat process works on a *client/server networking model*. Clients are required to obtain the `ClientSocket.js` application, as it comes pre-configured to connect to the `ServerSocket.js` application.

## Getting Started

1. To start the server application: `/node ServerSocket.js` 
2. To start the client application: `/node ClientSocket.js`

## Features

* **Entering the Server**
    * Users already connected are displayed in a list for the newly connected client. If no one is connected, the client is encouraged to invite friends.

* **Away From Keyboard**
    * `/afk`
    *  Inbound messages are not shown to the client. A notification for going or coming back from *AFK* is broadcasted to the server.

* **Exiting the Server**
    * `/exit` Properly exits the server. Broadcasted across chat.

* ~~**Unique Nicknames**~~
    * Currently not implemented. (2017-Dec-03)

* **Logging all messages to a file**
    * Currently not implemented. (2017-Dec-03)