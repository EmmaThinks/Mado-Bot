import type { CommandStructure } from "../../interfaces/Command.js";
import { EmbedBuilder as Embed } from "discord.js";

export const command: CommandStructure = {
  name: "version",
  aliases: ["v", "botinfo"],
  description: "Muestra la versión actual y estado del bot",
  run: async (mess) => {
    const embed = new Embed()
      .setTitle("M.A.D.O")
      .setDescription("Estado del sistema: Soñando")
      .addFields(
        { name: "Versión", value: "v1.0.5", inline: true },
        { name: "Modelo", value: "Gemini 2.5 Pro", inline: true },
      )
      .setFooter({ text: "Madotsuki . Advanced . Discord . Output" });

    await mess.reply({ embeds: [embed] });
  },
};
