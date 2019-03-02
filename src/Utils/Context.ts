import { IContext } from "typings";
import { Client, Message, User, Channel } from "discord.js";

class Context implements IContext {
	public readonly client: Client;
	public readonly invokedPrefix: string;
	public readonly message: Message;
	public readonly author: User;
	public readonly channel: Channel;

	constructor(message: Message, iPrefix: string) {
		this.client = message.client;
		this.invokedPrefix = iPrefix;
		this.message = message;
		this.author = message.author;
		this.channel = message.channel;
	}

	successMsg() {
		// Same as the bot.successMsg() from Lynx!!!
	}

	errorMsg() {
		// Same as the bot.errorMsg() from Lynx!!!
	}

	awaitReply() {
		// Implement awaitReply from the Misaki Bot thing!!!
	}

	send() {
		// Same as message.channel.send()
	}

	sendDm() {
		// Open and send message in DMs with author, returns the DM Channel!
	}
}