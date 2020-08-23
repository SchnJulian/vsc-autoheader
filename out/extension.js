'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const tag_1 = require("./tag");
const vscode = require("vscode");
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.addHeader', async function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            let header = parseHeader(context);
            let lineNumber = header.split(/\r\n|\r|\n/).length;
            const position = editor.selection.active;
            editor.insertSnippet(new vscode.SnippetString(header), new vscode.Position(0, 0));
            let suc = await vscode.commands.executeCommand("cursorMove", {
                to: "up",
                by: "wrappedLine",
                select: true,
                value: lineNumber++ // Line number of header
            });
            let suc1 = await vscode.commands.executeCommand('editor.action.addCommentLine');
            editor.selection = selection;
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function parseHeader(contex) {
    // TODO check if tags are present in the template
    // Fetch user defined credentials
    let name = vscode.workspace.getConfiguration('autoheader.header').get('name');
    let email = vscode.workspace.getConfiguration('autoheader.header').get('email');
    let github = vscode.workspace.getConfiguration('autoheader.header').get('github');
    let headerTemplate = vscode.workspace.getConfiguration('autoheader.header').get('header');
    let nameTag = new tag_1.Tag("<name>", /<name>/gi, name);
    let emailTag = new tag_1.Tag("<email>", /<email>/gi, email);
    let githubTag = new tag_1.Tag("<github>", /<github>/gi, github);
    let dateTag = new tag_1.Tag("<date>", /<date>/gi, getDate());
    let yearTag = new tag_1.Tag("<year>", /<year>/gi, getYear());
    let tags = new Array();
    tags.push(nameTag);
    tags.push(emailTag);
    tags.push(githubTag);
    tags.push(dateTag);
    tags.push(yearTag);
    tags.forEach(function (value) {
        if (headerTemplate.includes(value.text)) {
            headerTemplate = headerTemplate.replace(value.regex, value.value);
        }
    });
    return headerTemplate;
}
function getYear() {
    return new Date().getFullYear();
}
function getDate() {
    return new Date().getDate();
}
//# sourceMappingURL=extension.js.map