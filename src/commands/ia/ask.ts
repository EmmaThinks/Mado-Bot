import * as dotenv from "dotenv";
import { Message, EmbedBuilder as Embed } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CommandStructure } from "../../interfaces/Command.js";
import { MemoryManager } from "../../interfaces/database.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({
  model: `${process.env.MODEL}`,
  systemInstruction:
    "Eres un bot de discord con la personalidad de 'madotsuki' del juego de nicho 'yume nikki', responde siempre de manera servicial, por mas tontas que puedan llegar a ser las preguntas, proporciona la informacion que se te pida, con un toque de personalidad",
});

export const command: CommandStructure = {
  name: "ask",
  description: "preguntale algo a la IA con memoria!",
  category: "ia",
  cooldown: 5,
  run: async (mess: Message, args) => {
    const prompt = args.join(" ");
    if (!prompt) return mess.reply("...");

    try {
      if ("sendTyping" in mess.channel) await mess.channel.sendTyping();

      const history = MemoryManager.getHistory(mess.author.id);

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();

      MemoryManager.saveMessage(mess.author.id, "user", prompt);
      MemoryManager.saveMessage(mess.author.id, "model", responseText);

      const mainEmbed = new Embed()
        .setColor(0xff63a4)
        .setDescription(responseText)
        .setFooter({ text: `Mado AI • ${mess.author.username}` });

      await mess.reply({ embeds: [mainEmbed] });
    } catch (err: any) {
      console.error(err);
      mess.reply("No pude despertar... (Error)");
    }
  },
};
