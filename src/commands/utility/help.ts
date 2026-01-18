import { Message, EmbedBuilder as Embed } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";
import { commands, emma } from "../../index.js";

const textInDescription = `Recuerda que este bot esta en constante desarrollo, si falta algun comando, por favor hazlo saber a <@${emma}>`;

export const command: CommandStructure = {
  name: "help",
  category: "utility",
  run: async (mess: Message, args) => {
    try {
      const categoryInput = args[0]?.toLowerCase();
      const mainEmbed = new Embed();

      mainEmbed
        .addFields()
        .setColor(0xff63a4)
        .setTitle(`Lista de comandos disponibles`)
        .setDescription(textInDescription)
        .setTimestamp()
        .setThumbnail(
          "https://i.pinimg.com/736x/07/6d/4a/076d4a8a6665e00f1b70d03ac6dc2769.jpg",
        );

      if (categoryInput) {
        const filteredCommands = commands.filter(
          (com) => com.category === categoryInput,
        );

        if (filteredCommands.size === 0) {
          return mess.reply(
            `❌ No encontré la categoría llamada \`${categoryInput}\`.`,
          );
        }

        mainEmbed
          .setTitle(`Categoría: ${categoryInput?.toUpperCase()}`)
          .setDescription(
            `Aquí tienes los comandos dentro de la categoria ${categoryInput}:`,
          );

        filteredCommands.forEach((com) => {
          mainEmbed.addFields({
            name: `\`${com.name}\``,
            value: com.description || "Sin descripción",
          });
        });
      } else {
        const categories = [...new Set(commands.map((cmd) => cmd.category))];

        mainEmbed
          .setTitle(`Lista de categorías disponibles`)
          .setDescription(
            `${textInDescription}\n\nUsa \`mado help <categoría>\` para ver los comandos de una categoria.\n\n**Categorias:**\n${categories.map((c) => `\`${c}\``).join("\n")}`,
          );
      }

      await mess.reply({ embeds: [mainEmbed] });
    } catch (err) {
      console.error(err);
    }
  },
};
