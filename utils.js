function getTimestamp() {
    const date = new Date();
    return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
}

module.exports = { getTimestamp };