const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { DEFAULT_LANGUAGE } = require('../../constants');

function loadLanguage() {
    const locale = vscode.env.language;
    const filePath = path.join(__dirname, '..', '..', '..', 'languages', `${locale}.json`);

    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } else {
            const fallbackPath = path.join(__dirname, '..', '..', '..', 'languages', `${DEFAULT_LANGUAGE}.json`);
            return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error loading language file: ${error}`);
        return {};
    }
}

module.exports = { loadLanguage };