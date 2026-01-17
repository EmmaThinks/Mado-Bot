import { Message, EmbedBuilder as Embed } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";
import { commands, emma } from "../../index.js";

const textInDescription = `Recuerda que este bot esta en constante desarrollo, si falta algun comando, por favor hazlo saber a <@${emma}>`;

export const command: CommandStructure = {
  name: "help",
  run: async (mess: Message, args) => {
    try {
      const mainEmbed = new Embed();

      const getAvatar = mess.author.avatarURL({
        forceStatic: false,
        extension: "png",
      });

      mainEmbed
        .addFields()
        .setColor(0xff63a4)
        .setTitle(`Lista de comandos disponibles`)
        .setDescription(textInDescription)
        .setTimestamp()
        .setThumbnail(
          "https://i.pinimg.com/736x/07/6d/4a/076d4a8a6665e00f1b70d03ac6dc2769.jpg",
        );

      commands.forEach((com) => {
        if (com.name !== "help") {
          mainEmbed.addFields({
            name: `\`${com.name}\``,
            value: `${com.description}`,
          });
        }
      });

      mess.reply({ embeds: [mainEmbed] });
    } catch (err) {
      console.error(err);
    }
  },
};
