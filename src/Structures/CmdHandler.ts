import { Message } from 'discord.js';
import { GuildConfig } from "../Utils/GuildConfig";


export class CmdHandler {
  constructor() {
    throw new Error('This class may not be instantiated!');
  }

  static checkPrefix(message: Message, config: GuildConfig): string | boolean {
    return false;
  }
}
