export class Tag {
	constructor(text : string, regex : RegExp, value : string) {
		this.text = text;
		this.regex = regex;
		this.value = value;
	}

	text : string;
	regex : RegExp;
	value : string | null;
}