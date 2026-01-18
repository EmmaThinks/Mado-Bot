import { Message, PermissionsBitField } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

export const command: CommandStructure = {
  name: "clear",
  category: "mod",
  description:
    "borra tantos mensajes del chat como puedas! maximo de 100 mensajes en un solo comando",
  run: async (mess: Message, args) => {
    try {
      let msgCant: number = 0;

      if (
        !mess.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)
      )
        return mess.reply(
          "No tienes los permisos suficientes para ejecutar ese comando!",
        );

      if (args[0] === undefined)
        return mess.reply(
          "Especifica la cantidad de mensajes que quieras borrar!",
        );

      msgCant = parseInt(args[0]);
      if (msgCant > 100)
        return mess.reply(
          "La cantidad maxima de mensajes que puedes borrar son 100!",
        );

      if ("bulkDelete" in mess.channel) {
        await mess.channel.bulkDelete(msgCant, true);
        return mess.channel.send(`eliminados ${msgCant} mensajes del chat`);
      }

      mess.reply(`Borrados ${msgCant} mensajes del chat`);
    } catch (err) {
      console.error(err);
      mess.reply("No se pudieron eliminar los mensajes del chat");
    }
  },
};
