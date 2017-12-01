function getTimestamp() {
    const date = new Date();
    return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
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
module.exports = { getTimestamp, consoleOut, formatMessage };