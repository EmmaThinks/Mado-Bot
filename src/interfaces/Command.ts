//importamos message de discord.js para poder usarlo como tipo de dato y que ts no moleste
import { Message } from "discord.js";

//hacemos una interfaz con "export" al principio, para poder pasarla a otros archivos
export interface CommandStructure {
  //definimos la estructura, nombre, alias y la funcion que realizara con sus respectivos argumentos
  name: string;
  category?: string;
  // en el caso de run, definimos explicitamente que NECESITA ser una funcion flecha, con los argumentos message y args, apuntando a void, que quiere decir que la funcion
  // no va a retornar nada
  run: (message: Message, args: string[]) => void;
  description?: string;
  cooldown?: number;
}
