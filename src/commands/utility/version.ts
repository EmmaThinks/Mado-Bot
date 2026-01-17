import type { CommandStructure } from "../../interfaces/Command.js";
import { EmbedBuilder as Embed } from "discord.js";
import { emma } from "../../index.js";
import dotenv from "dotenv";

dotenv.config();

export const command: CommandStructure = {
  name: "version",
  aliases: ["v", "botinfo"],
  description: "Muestra la versión actual y estado del bot",
  run: async (mess) => {
    const embed = new Embed()
      .setTitle("M.A.D.O")
      .setColor(0xff63a4)
      .setDescription("Estado del sistema: Soñando")
      .addFields(
        { name: "Versión:", value: `${process.env.VERSION}`, inline: true },
        { name: "Modelo:", value: "Gemini 2.5 Pro", inline: true },
        { name: "Desarrolladora:", value: `<@${emma}>`, inline: true },
        { name: "Host:", value: "Google Cloud VM", inline: true },
      )

      .setFooter({ text: "Madotsuki . Advanced . Discord . Output" })
      .setTimestamp();

    await mess.reply({ embeds: [embed] });
  },
};
