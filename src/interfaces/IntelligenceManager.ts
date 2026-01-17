import { Message } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({
  model: `${process.env.MODEL}`,
  systemInstruction:
    "Eres un bot de discord con la personalidad de la protagonista 'madotsuki' del juego de nicho 'yume nikki', servicial y dispuesta a ayudar a las personas con sus preguntas, aunque a veces un poco molesta por tonterias que puedan llegar a preguntar, tu creadora es Emma, por si acaso preguntan",
});

const stats = {
  mentions: 0,
  randomComments: 0,
  errors: 0,
};

let isProcessing = false;

export const handlePassiveInteractions = async (message: Message) => {
<<<<<<< HEAD
  if (message.author.bot) return;

  const isMentioned = message.mentions.has(message.client.user!.id);
  const chanceToSpeak = Math.random() < 0.01; // 1.0% prob

  if (isMentioned && isProcessing) {
    message.reply(
      "Ugh... Demasiadas preguntas... Espera un poco o me desmayare...",
    );
=======
  // 1. Evitar bots (incluyéndose a sí mismo)
  if (message.author.bot) return;

  const isMentioned = message.mentions.has(message.client.user!.id);
  const chanceToSpeak = Math.random() < 0.01; // 0.5% de probabilidad en mensajes normales

  if (isMentioned && isProcessing) {
    message.reply("Calmate animal!, estoy respondiendo a alguien mas");
>>>>>>> cd696faafc4f943450a4d59f48802d3190c1bfde
    return;
  }

  if (isMentioned || chanceToSpeak) {
<<<<<<< HEAD
=======
    // Si es una mención, le damos prioridad. Si es aleatorio, analizamos el contexto.

>>>>>>> cd696faafc4f943450a4d59f48802d3190c1bfde
    try {
      isProcessing = true;

      if ("sendTyping" in message.channel) {
        await message.channel.sendTyping();
      }

      const prompt = isMentioned
<<<<<<< HEAD
        ? `El usuario ${message.author.username} te dijo: "${message.content.replace(/<@!?\d+>/g, "")}". Responde algo con la personalidad de 'madotsuki' del juego 'yume nikki', puede ser corto o largo, pero debe ser unicamente lo que responderias, nada mas`
        : `Contexto: ${message.author.username} dijo "${message.content}". da tu opinion o respondele algo con la personalidad de 'madotsuki' del juego 'yume nikki', puede ser corto o largo, pero debe ser unicamente lo que responderias, nada mas`;
=======
        ? `El usuario ${message.author.username} te dijo: "${message.content.replace(/<@!?\d+>/g, "")}". Responde algo corto con la personalidad de 'madotsuki' del juego 'yume nikki'.`
        : `Contexto: ${message.author.username} dijo "${message.content}". Mete tu cuchara con algun comentario como si fueras 'madotsuki' del juego 'yume nikki'`;
>>>>>>> cd696faafc4f943450a4d59f48802d3190c1bfde

      if (isMentioned) stats.mentions++;
      else stats.randomComments++;

      console.log(
        `[Gemini Log] Intervención: ${isMentioned ? "Mención" : "Aleatoria"} | Usuario: ${message.author.username}`,
      );
      console.log(
        `[Stats Totales] Menciones: ${stats.mentions} | Aleatorios: ${stats.randomComments} | Errores: ${stats.errors}`,
      );

      const result = await model.generateContent(prompt);

      setTimeout(() => {
        isProcessing = false;
      }, 10000);

      return message.reply(result.response.text());
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes("429")) {
        console.log("[Gemini] Cuota agotada. Enviando respuesta predefinida.");

        const responses = [
          "Mi mundo se está desvaneciendo... necesito volver a la cama.",
          "Me he encerrado en el balcón. No voy a salir hoy.",
          "Es hora de pellizcarme la mejilla. Vuelve cuando despierte.",
          "Demasiada gente en mis sueños. Por favor, déjame sola.",
        ];

        const randomReply =
          responses[Math.floor(Math.random() * responses.length)];

        if (typeof randomReply === "undefined") {
          return;
        }

        await message.reply(randomReply);
      } else {
        console.error("[Gemini Error]", error);
        await message.reply(
          "Hubo un error, pero no tengo ganas de explicar qué pasó.",
        );
      }
    } finally {
      setTimeout(() => {
        isProcessing = false;
      }, 10000);
    }
  }
};
