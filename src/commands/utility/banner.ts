import { Message, User, EmbedBuilder as embed } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "banner",
  description: "Mira el Banner de un usuario o de ti mism@",
  run: async (mess: Message, args) => {
    try {
      const targetUser: User = mess.mentions.users.first() || mess.author;
      const fetchedTargetUser = await targetUser.fetch();

      if (fetchedTargetUser === undefined || fetchedTargetUser === null)
        return mess.reply("El usuario no cuenta con un banner");

      const mainEmbed = new embed()
        .setImage(
          `${fetchedTargetUser.bannerURL({
            size: 4096,
            extension: "png",
            forceStatic: false,
          })}`,
        )
        .setTitle(`banner de ${targetUser.displayName}`);

      if ("reply" in mess) {
        mess.reply({ embeds: [mainEmbed] });
      }
    } catch (err) {
      console.error(err);
      mess.reply(
        `No se pudo obtener el banner del usuario ${mess.mentions.users.first() || mess.author}`,
      );
    }
  },
};
