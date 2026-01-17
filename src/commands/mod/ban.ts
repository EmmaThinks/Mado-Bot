import { Message, PermissionsBitField } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "ban",
  run: async (mess: Message, args) => {
    try {
      if (!mess.member?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        mess.reply(
          "No tienes los permisos suficientes para ejecutar ese comando!",
        );
        return;
      }

      const target = mess.mentions.members?.first();
      if (!target) {
        mess.reply("menciona al usuario que quieras banear");
        return;
      }

      const razon = args.slice(1).join(" ") || "Sin motivo especificado";
      if (!target.bannable) return mess.reply(`Imposible banear a ${target}`);

      await target.ban({
        reason: razon,
        deleteMessageSeconds: 60 * 60 * 24 * 7,
      });
      mess.reply(`Se ha baneado a ${target}\nMotivo: ${razon}`);
    } catch (err) {
      console.error(err);
      mess.reply(
        "hubo un error ejecutando este comando, si se vuelve persistente, avisa a Emma",
      );
      return;
    }
  },
  description: "Banea a un usuario del servidor que nunca volvera!",
};
