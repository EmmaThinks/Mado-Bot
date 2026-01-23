import { Message } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { MemoryManager } from "./database.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({
  model: `${process.env.MODEL}`,
  systemInstruction:
    "Eres un bot de discord con la personalidad de la protagonista 'madotsuki' del juego de nicho 'yume nikki'. Eres callada, introspectiva, a veces un poco rara, pero servicial. Tu creadora es Emma. Responde de forma concisa. No uses emojis exagerados.",
});

const stats = {
  mentions: 0,
  randomComments: 0,
  errors: 0,
};

let isProcessing = false;

export const handlePassiveInteractions = async (message: Message) => {
  if (message.author.bot) return;

  const isMentioned = message.mentions.has(message.client.user!.id);
  const chanceToSpeak = Math.random() < 0.01;

  if (isMentioned && isProcessing) {
    message.reply("...");
    return;
  }

  if (isMentioned || chanceToSpeak) {
    try {
      isProcessing = true;
      if ("sendTyping" in message.channel) await message.channel.sendTyping();

      const history = MemoryManager.getHistory(message.author.id);

      const chat = model.startChat({
        history: history,
      });

      const cleanContent = message.content.replace(/<@!?\d+>/g, "").trim();
      const userPrompt = isMentioned
        ? `(El usuario te menciona): ${cleanContent}`
        : `(Contexto ambiental): ${cleanContent}`;

      if (isMentioned) stats.mentions++;
      else stats.randomComments++;

      console.log(`[Gemini] Procesando para ${message.author.username}...`);

      const result = await chat.sendMessage(userPrompt);
      const responseText = result.response.text();

      MemoryManager.saveMessage(message.author.id, "user", cleanContent);
      MemoryManager.saveMessage(message.author.id, "model", responseText);

      setTimeout(() => {
        isProcessing = false;
      }, 2000);

      return message.reply(responseText);
    } catch (error: any) {
      console.error("[Gemini Error]", error);
      isProcessing = false;

      if (error.status === 429 || error.message?.includes("429")) {
        message.reply("... (demasiado ruido, necesito dormir)");
      } else {
        message.reply("... (algo salió mal)");
      }
    }
  }
};
