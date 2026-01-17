import { Message, PermissionsBitField } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "kick",
  run: async (mess: Message, args) => {
    try {
      if (
        !mess.member?.permissions.has(PermissionsBitField.Flags.KickMembers)
      ) {
        mess.reply(
          "No tienes los permisos suficientes para ejecutar ese comando!",
        );
        return;
      }

      const target = mess.mentions.members?.first();
      if (!target) {
        mess.reply("menciona al usuario que quieras kickear");
        return;
      }

      const razon = args.slice(1).join(" ") || "Sin motivo especificado";

      if (!target.kickable) return mess.reply(`Imposible banear a ${target}`);

      await target.kick(razon);
      mess.reply(`Se ha kickeado a ${target}\nMotivo: ${razon}`);
    } catch (err) {
      console.error(err);
      mess.reply(
        "hubo un error ejecutando este comando, si se vuelve persistente, avisa a Emma",
      );
      return;
    }
  },
  description:
    "Saca a un usuario del servidor! pero cuidado que se puede unir de nuevo!",
};
