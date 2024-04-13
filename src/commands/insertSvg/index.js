const vscode = require('vscode');
const { fetchSVGs, fetchSVGContent } = require('../../services/svglService');
const languageService = require('../../services/languageService/');

const translations = languageService.loadLanguage();

function insertSVGCommand(context) {
    // The command is asynchronous and uses error handling to manage command execution
    let disposable = vscode.commands.registerCommand('svgl-vscode.insertSVG', async () => {
        try {
            const query = await _getUserInput();
            if (query) {
                const svgs = await fetchSVGs(query);
                const picks = _generateQuickPickItems(svgs);
                const selectedPick = await _showQuickPick(picks);
                if (selectedPick) {
                    _insertSVGIntoEditor(selectedPick);
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to insert SVG: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

// Prompts the user for input using VS Code's input box
async function _getUserInput() {
    return vscode.window.showInputBox({ placeHolder: translations.inputPlaceholder });
}

// Converts SVG data to a format suitable for displaying in a quick pick menu
function _generateQuickPickItems(svgs) {
    return svgs.flatMap(svg => _svgDetailMapper(svg));
}

// Displays a quick pick menu and allows the user to select an SVG
async function _showQuickPick(picks) {
    return vscode.window.showQuickPick(picks, { placeHolder: translations.chooseSVG });
}

// Inserts the selected SVG content into the active editor at 
// the current cursor position
async function _insertSVGIntoEditor(pick) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const svgContent = await fetchSVGContent(pick.detail);
        editor.edit(editBuilder => {
            editBuilder.insert(position, svgContent);
        });
    }
}

// Maps SVG data to the necessary structure for quick pick items
// handling both single and themed SVGs
function _svgDetailMapper(svg) {
    return typeof svg.route === 'string'
        ? { label: svg.title, description: '', detail: svg.route, svg }
        : Object.entries(svg.route).map(([theme, url]) => ({
            label: `${svg.title} (${theme})`,
            description: theme,
            detail: url,
            svg
        }));
}

module.exports = {
    insertSVGCommand
};
