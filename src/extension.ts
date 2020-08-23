'use strict';

import { Tag } from './tag';
import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.addHeader', async function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			let header = parseHeader(context);
			
			let lineNumber = header.split(/\r\n|\r|\n/).length;
			const position = editor.selection.active;

			editor.insertSnippet(new vscode.SnippetString(header), new vscode.Position(0,0));

			let suc = await vscode.commands.executeCommand("cursorMove", {
				to: "up",
				by: "wrappedLine",
				select: true,
				value: lineNumber++ // Line number of header
			  }); 
		
			  
			let suc1 =  await vscode.commands.executeCommand('editor.action.addCommentLine');
			editor.selection = selection;
		}

		

	});

	context.subscriptions.push(disposable);
}

function parseHeader(contex: vscode.ExtensionContext){
	// TODO check if tags are present in the template


	// Fetch user defined credentials
	let name = vscode.workspace.getConfiguration('autoheader.header').get('name') as string;
	let email = vscode.workspace.getConfiguration('autoheader.header').get('email') as string;
	let github = vscode.workspace.getConfiguration('autoheader.header').get('github') as string;
	let headerTemplate: string = vscode.workspace.getConfiguration('autoheader.header').get('header') as string;

	
	let nameTag = new Tag("<name>", /<name>/gi, name);
	let emailTag = new Tag("<email>", /<email>/gi, email);
	let githubTag = new Tag("<github>", /<github>/gi, github);
	let dateTag = new Tag("<date>", /<date>/gi, getDate());
	let yearTag = new Tag("<year>", /<year>/gi, getYear());

	let tags : Tag[] = new Array();
	tags.push(nameTag);
	tags.push(emailTag);
	tags.push(githubTag);
	tags.push(dateTag);
	tags.push(yearTag);

	tags.forEach(function (value){
		if(headerTemplate.includes(value.text)){
			headerTemplate = headerTemplate.replace(value.regex, value.value as string);
		}
	});

	return headerTemplate;
}

function getYear(){
	return new Date().getFullYear() as unknown as string;
}

function getDate(){
	return new Date().getDate() as unknown as string;
}
