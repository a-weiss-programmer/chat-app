const COMMANDS = {nick: 'nick', afk: 'afk', exit: 'exit'};

/**
 * Appends a zero if the number is not 2 digits
 * @param {String} n The timestamp
 * @returns The timestamp prepended with a zero if necessary
 */
function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
}

/**
 * Gets current time and formats it to a nice timestamp
 * @returns The current time as a timestamp
 */
function getTimestamp() {
    const date = new Date();
    return `[${addZeroBefore(date.getHours())}:${addZeroBefore(date.getMinutes())}:${addZeroBefore(date.getSeconds())}]`;
}

/**
 * Logs the output and moves the file pointer to the beginning of the line.
 * Necessary for the readline module.
 * @param {Readline} scanner The readline used to reprompt the user
 * @param {String} msg The message to log out to the user.
 */
function consoleOut(scanner, msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    scanner.prompt(true);
}

/**
 * Formats the message to look like an IRC chat message
 * @param {String} nickname The nickname of the user sending the message
 * @param {String} msg The message to be sent
 * @returns The formatted message with the current timestamp
 */
function formatMessage(nickname, msg) {
    return `${getTimestamp()} ${nickname}: ${msg}`;
}

/**
 * Formats the message for event messages. Basically formatMessage
 * without the nickname.
 * 
 * @param {String} msg The message to format
 * @returns The message prepended with a timestamp
 */
function formatEventMessage(msg) {
    return `${getTimestamp()} ${msg}`;
}

/**
 * Checks if the message is a slash command
 * @param {String} msg 
 * @returns a boolean determining whether or not it's a slash command.
 */
function isCommand(msg) {
    return (msg[0] == '/' && msg.length > 1);
}

/**
 * Grabs the slash command and breaks it up into a 
 * @param {String} msg The slash command in question
 * @returns an object containing the command and argument
 */
function getCommand(msg) {
    if (isCommand(msg)) {
        let command = msg.match(/[a-z]+\b/)[0];
        let argument = msg.substr(command.length + 2, msg.length);
        return {
            command: command,
            argument: argument
        };
    }
    return null;
}

module.exports = { getTimestamp, consoleOut, formatMessage, formatEventMessage, isCommand, getCommand, COMMANDS };