const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'mongoLog.txt');

function formatDate() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US');
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `[${date} | ${time}]`;
}

function logChange(type, userEmail, itemName) {
    if (!userEmail || !itemName) return;

    const logLine = `${formatDate()} | Change Type: ${type} | User: ${userEmail} | Item Changed: ${itemName}\n`;

    fs.appendFile(logFilePath, logLine, err => {
        if (err) console.error("Failed to write log:", err);
    });
}

module.exports = { logChange };
