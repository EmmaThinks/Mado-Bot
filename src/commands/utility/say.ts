import { Message } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "say",
  description: "Haz que el bot diga algo",
  category: "utility",
  run: async (mess: Message, args) => {
    try {
      const whatToSay = args.join(" ");
      mess.delete();

      if ("send" in mess.channel) {
        mess.channel.send(whatToSay);
      }
    } catch (err) {
      console.error(err);
    }
  },
};
