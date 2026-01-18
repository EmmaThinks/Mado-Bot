import { Message, PermissionsBitField } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  category: "mod",
  name: "mute",
  run: async (mess: Message, args) => {
    try {
      if (
        !mess.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)
      ) {
        mess.reply(
          "No tienes los permisos suficientes para ejecutar ese comando!",
        );
        return;
      }

      const target = mess.mentions.members?.first();
      if (!target) {
        mess.reply("menciona al usuario que quieras mutear");
        return;
      }

      const razon = args.slice(2).join(" ") || "";
      const time = args[1];
      let mS: number = 0;

      if (time === undefined) {
        mS = 2419200000;
      } else {
        const cant: number = parseInt(time);

        if (time.endsWith("s")) {
          mS = cant * 1000;
        } else if (time.endsWith("m")) {
          mS = cant * 60 * 1000;
        } else if (time.endsWith("h")) {
          mS = cant * 60 * 60 * 1000;
        } else {
          return mess.reply("Formato de tiempo invalido, utiliza: h, m, s");
        }
      }

      await target.timeout(mS, razon);
      mess.reply(`Se ha muteado a ${target}\nMotivo: ${razon}`);
    } catch (err) {
      console.error(err);
      mess.reply(
        "hubo un error ejecutando este comando, si se vuelve persistente, avisa a Emma",
      );
      return;
    }
  },
  description: "Aisla algun usuario del servidor! tiempo maximo: 30 dias",
};
