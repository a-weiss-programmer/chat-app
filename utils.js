const COMMANDS = {nick: 'nick', afk: 'afk'};

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
module.exports = { getTimestamp, consoleOut, formatMessage, formatEventMessage, isCommand, getCommand, COMMANDS };