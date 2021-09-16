export type CommandArgumentChoice = {
	label: string;
	value: number | string;
};

export type CommandArgument = {
	name: string;
	description?: string;
	required?: boolean;
	type?: string;
	choices?: CommandArgumentChoice[];
	multiple?: boolean;
};

export default CommandArgument;
