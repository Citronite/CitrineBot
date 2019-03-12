import { IMessageContext } from 'typings';

import { Client,
	Message,
	User,
	TextChannel,
	DMChannel,
	GroupDMChannel,
	MessageReaction,
	Emoji,
	ReactionEmoji
} from 'discord.js';

type reaction = string | Emoji | ReactionEmoji;

export class MessageContext implements IMessageContext {
	public readonly client: Client;
	public readonly invokedPrefix: string;
	public readonly message: Message;
	public readonly author: User;
	public readonly channel: TextChannel | DMChannel | GroupDMChannel;

	constructor(message: Message, iPrefix: string) {
		this.client = message.client;
		this.invokedPrefix = iPrefix;
		this.message = message;
		this.author = message.author;
		this.channel = message.channel;
	}

	public async success(msg: string, embed: boolean = true): Promise<Message | Message[]> {
		if (embed) {
			// color: green
			return this.channel.send('Success Embed!');
		} else {
			return this.channel.send(`✅ **Success:** ${msg}`);
		}
	}

	public async error(msg: string, embed: boolean = true): Promise<Message | Message[]> {
		if (embed) {
			// color: red
			return this.channel.send('Error Embed!');
		} else {
			return this.channel.send(`⛔ **Error:** ${msg}`);
		}
	}

	public async alert(msg: string, embed: boolean = true): Promise<Message | Message[]> {
		if (embed) {
			// color: yellow
			return this.channel.send('Alert Embed!');
		} else {
			return this.channel.send(`⚠ **Alert:** ${msg}`);
		}
	}

	public async confirm(msg: string, timeOut: number = 30000): Promise<boolean | null> {
		// Use reactions instead of yes/no replies bc why not :P
		return Promise.reject('Not Implemented');
	}

	public async prompt(msg: string, contentOnly: boolean = true, timeOut: number = 30000): Promise<Message | string | null> {
		return Promise.reject('Not Implemented');
		// Implement using a reaction collector? idk :v
	}

	public async promptReaction(msg: string, emojis: reaction[], limit: number = 1, timeOut: number = 30000): Promise<MessageReaction[] | null> {
		return Promise.reject('Not Implemented');
		// Kinda like awaitReply, but waits for a reaction on the bot message. Could be used for yes/no stuff?
		// First param would be msg to send, second param list of reactions to await.
	}

	public async send(...args: any): Promise<Message | Message[]> {
		return this.channel.send(...args);
	}

	public async reply(...args: any): Promise<Message | Message[]> {
		return this.message.reply(...args);
	}

	public async sendDM(...args: any): Promise<Message | Message[]> {
		return this.author.send(...args);
	}
}
