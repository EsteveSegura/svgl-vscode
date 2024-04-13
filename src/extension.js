const { insertSVGCommand } = require('./commands/insertSvg');

function activate(context) {
    insertSVGCommand(context);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
