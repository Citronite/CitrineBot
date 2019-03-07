import { IContext } from 'typings';
import { Client, Message, User, Channel } from 'discord.js';

export class Context implements IContext {
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

	public successMsg() {
		// Same as the bot.successMsg() from Lynx!!!
	}

	public errorMsg() {
		// Same as the bot.errorMsg() from Lynx!!!
	}

	public awaitReply() {
		// Implement awaitReply from the Misaki Bot thing!!!
	}

	public awaitReaction() {
		// Kinda like awaitReply, but waits for a reaction on the bot message. Could be used for yes/no stuff?
		// First param would be msg to send, second param list of reactions to await.
	}

	public send() {
		// Same as message.channel.send()
	}

	public reply() {
		// Same as message.reply();
	}

	public sendDM() {
		// Open and send message in DMs with author, returns the DM Channel!
	}
}
