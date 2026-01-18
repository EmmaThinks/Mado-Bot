import dotenv from "dotenv";
import { Message, EmbedBuilder as Embed } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CommandStructure } from "../../interfaces/Command.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({
  model: `${process.env.MODEL}`,
  systemInstruction:
    "Eres un bot de discord con la personalidad de la protagonista 'madotsuki' del juego de nicho 'yume nikki', servicial y dispuesta a ayudar a las personas con sus preguntas, si te preguntan, Emma es tu creadora",
});

export const command: CommandStructure = {
  name: "ask",
  description: "preguntale algo a la IA del bot!",
  category: "ia",
  cooldown: 30,
  run: async (mess: Message, args) => {
    const prompt = args.join(" ");

    if (!prompt) {
      return mess.reply("Escribe lo que quieras que la IA responda!");
    }

    try {
      if ("sendTyping" in mess.channel) {
        await mess.channel.sendTyping();
      }

      const response = await model.generateContent(prompt);
      const responseText = response.response.text();

      const mainEmbed = new Embed()
        .setColor(0xff63a4)
        .setAuthor({
          name: "mado AI",
          iconURL:
            "https://i.pinimg.com/736x/82/7e/6c/827e6c8acd2b9471563c3a2475aa8d11.jpg",
        })
        .setDescription(
          responseText.length > 4096
            ? responseText.substring(0, 4000) + "..."
            : responseText,
        )
        .setFooter({ text: `Preguntado por ${mess.author.username}` })
        .setTimestamp();

      await mess.reply({ embeds: [mainEmbed] });
    } catch (err: any) {
      console.error(err);
      mess.reply(
        "No se pudo procesar el prompt. Esto puede deberse a filtros de seguridad o un error de red. Intenta con algo distinto.",
      );

      if (err.status === 429 || err.message?.includes("429")) {
        mess.reply(
          "Se nos acabaron las cargas del plan gratuito, vuelve mañana",
        );
      }
    }
  },
};
