import { Client, GatewayIntentBits, Collection, Message } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { CommandStructure } from "./interfaces/Command.js";
import { checkCooldown } from "./interfaces/cdmanager.js";
import { handlePassiveInteractions } from "./interfaces/IntelligenceManager.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

export const commands = new Collection<string, CommandStructure>();
export const emma: string = "1154267431053840414";

const token = process.env.TOKEN;
const preFix = "mado";

const loadCommands = async () => {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      try {
        const commandImport = await import(pathToFileURL(filePath).href);
        const command = commandImport.command;

        if (command && "name" in command && "run" in command) {
          command.category = folder.toLowerCase();

          commands.set(command.name, command);
          console.log(`Comando cargado: ${command.name} [${folder}]`);
        } else {
          console.log(`${file} no tiene la estructura correcta.`);
        }
      } catch (error) {
        console.error(`❌ Error cargando ${file}:`, error);
      }
    }
  }
};

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(preFix))
    return await handlePassiveInteractions(message);

  const args = message.content.slice(preFix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = commands.get(commandName);

  if (!command) return;

  try {
    const timeLeft = checkCooldown(
      message.author.id,
      command.name,
      command.cooldown || 3,
    );
    if (timeLeft) {
      return message.reply(
        `Calmate animal ${timeLeft.toFixed(1)}s más antes de usar \`${command.name}\`, por el bien del plan gratuito.`,
      );
    }

    await command.run(message, args);
  } catch (error) {
    console.error(error);
    message.reply(
      "Hubo un error ejecutando ese comando, pidele a emma que lo arregle plz.",
    );
  }
});

loadCommands().then(() => {
  client.login(token);
});
