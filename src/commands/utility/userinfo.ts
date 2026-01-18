import { EmbedBuilder as Embed, Message, GuildMember } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "userinfo",
  description: "Mira la informacion de la cuenta de algun usuario o tuya!",
  category: "utility",
  run: async (mess: Message, args) => {
    try {
      const target = mess.mentions.users.first() || mess.author;
      const targetFetched = await mess.guild?.members.fetch(target.id);
      const getUserAvatar = target.avatarURL();

      const createdTimestamp = Math.floor(target.createdTimestamp / 1000);
      const joinedTimestamp = targetFetched?.joinedAt
        ? Math.floor(targetFetched.joinedAt.getTime() / 1000)
        : null;

      const mainEmbed = new Embed()
        .setTitle(`Info de ${target.displayName}`)
        .setColor(0xff63a4)
        .setDescription(`Esto fue lo que pude encontrar del usuario...`)
        .setThumbnail(`${getUserAvatar}`)
        .addFields(
          {
            name: `Nombre de Cuenta`,
            value: `\`${target.displayName}\``,
            inline: true,
          },
          {
            name: `Nombre de Usuario`,
            value: `\`${target.username}\``,
            inline: true,
          },
          {
            name: `Apodo en el servidor`,
            value: `${targetFetched?.nickname ? `\`${targetFetched.nickname}\`` : `\`Sin apodo\``}`,
            inline: true,
          },
          {
            name: `Se unio a discord en`,
            value: `<t:${createdTimestamp}:f> (<t:${createdTimestamp}:R>)`,
            inline: true,
          },
          {
            name: `Se unio al servidor en`,
            value: joinedTimestamp
              ? `<t:${joinedTimestamp}:f> (<t:${joinedTimestamp}:R>)`
              : "`No disponible`",
            inline: true,
          },
          { name: `ID`, value: `\`${target.id}\`` },
        );

      const deco = target.avatarDecorationURL();
      if (deco) {
        mainEmbed.addFields({
          name: `Decoracion de Avatar`,
          value: `[Descargar decoración](${deco})`,
        });
      }

      if ("send" in mess.channel) {
        await mess.reply({ embeds: [mainEmbed] });
      }
    } catch (err) {
      console.error(err);
      mess.reply("Hubo un error intentado ejecutar este comando");
    }
  },
};
