import { Message, User, EmbedBuilder as embed } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "avatar",
  description: "Mira el Avatar de un usuario o de ti mism@",
  run: (mess: Message, args) => {
    try {
      const targetUser: User = mess.mentions.users.first() || mess.author;
      const avatarURL = targetUser.avatarURL({
        extension: "png",
        forceStatic: false,
        size: 2048,
      });

      const mainEmbed = new embed()
        .setImage(avatarURL)
        .setTitle(`avatar de ${targetUser.displayName}`);

      if ("reply" in mess) {
        mess.reply({ embeds: [mainEmbed] });
      }
    } catch (err) {
      console.error(err);
      mess.reply(`No se pudo obtener el avatar del usuario ${args[0]}`);
    }
  },
};
