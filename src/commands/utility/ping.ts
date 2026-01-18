//importamos de discord.js y del archivo de comandos la interfaz
import { Message } from "discord.js";
import type { CommandStructure } from "../../interfaces/Command.js";

// definimos una variable constante como una nueva instancia de la interfaz, la funcion debe ser asincrona, ya que interactua con el servidor, asi no se congela el bot
// cuando queramos hacer otra cosa mientras esperamos que conteste el bot
// usamos export, de nuevo, para poder exportar a otro archivo
export const command: CommandStructure = {
  //le damos el nombre a la estructura del comando
  name: "ping",
  category: "utility",
  //establecemos la funcion que va a cumplir, en este caso, ping de la api y el bot
  run: async (mess: Message, args) => {
    // establecemos una constante donde le respondemos al usuario que estamos trabajando en el calculo
    // como estamos interactuando con el servidor, utilizamos await

    const response = await mess.reply("Calculando tiempo de respuesta...");
    // calculamos el tiempo que tardo el mensaje del usuario en enviarse menos el tiempo que tardo el mensaje del bot en enviarse para obtener la latencia
    let ping = response.createdTimestamp - mess.createdTimestamp;

    //editamos ese mismo mensaje, de nuevo, usando await para cuando interactuamos con el servidor
    await response.edit(
      `Latencia del bot: ${ping}ms\nLatencia de la API: ${mess.client.ws.ping}ms`,
    );
  },
  description:
    "calcula el tiempo que tarda tu mensaje en llegar al bot y el tiempo de respuesta de la API",
};
