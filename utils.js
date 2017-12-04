const COMMANDS = {nick: 'nick', afk: 'afk', exit: 'exit', help: 'help'};

function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

function getTimestamp() {
    const date = new Date();
    return `[${addZeroBefore(date.getHours())}:${addZeroBefore(date.getMinutes())}:${addZeroBefore(date.getSeconds())}]`;
}

function consoleOut(scanner, msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    scanner.prompt(true);
}

function displayHelpMessage(scanner) {
    let msg = `
    These are the commands that are available for your use, kind Sir:
    /afk 		-This command will set you to Away From Keyboard (you will not receive messages until using /afk again)
    /exit		-This command will disconnect you from the chat
    /nick [arg]	-This command will allow you to change your nickname (replace [arg] with desired nickname)
    /help 		-This command will produce a brief overview of the chat's commands
    Created by Casey Largent, Kevin Nicklen, and Erik Shafer 2017
    `;
    consoleOut (scanner, msg);
}
function formatMessage(nickname, msg) {
    return `${getTimestamp()} ${nickname}: ${msg}`;
}

function formatEventMessage(msg) {
    return `${getTimestamp()} ${msg}`;
}

function isCommand(msg) {
    return (msg[0] == '/' && msg.length > 1);
}

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
module.exports = { getTimestamp, consoleOut, formatMessage, formatEventMessage, isCommand, getCommand, displayHelpMessage, COMMANDS };