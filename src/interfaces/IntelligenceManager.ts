import { Message } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { MemoryManager } from "./database.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const chatModel = genAI.getGenerativeModel({
  model: `${process.env.MODEL}`,
});

const analysisModel = genAI.getGenerativeModel({
  model: `${process.env.MODEL}`,
});

const stats = { mentions: 0, randomComments: 0 };
let isProcessing = false;

export const handlePassiveInteractions = async (message: Message) => {
  if (message.author.bot) return;

  const isMentioned = message.mentions.has(message.client.user!.id);
  const chanceToSpeak = Math.random() < 0.01;
  const chanceToLearn = Math.random() < 0.2;

  if (isMentioned && isProcessing) return;

  if (isMentioned || chanceToSpeak) {
    try {
      isProcessing = true;
      if ("sendTyping" in message.channel) await message.channel.sendTyping();

      const userId = message.author.id;
      const userName = message.author.username;

      const userProfile = MemoryManager.getUserProfile(userId);
      const chatHistory = MemoryManager.getHistory(userId);

      let systemInstruction = `Eres 'madotsuki' de Yume Nikki. Introvertida, onírica, servicial.`;

      if (userProfile) {
        systemInstruction += `\n[MEMORIA A LARGO PLAZO]\nSabes esto del usuario: "${userProfile}". Úsalo para personalizar la charla, pero no lo repitas como robot.`;
      } else {
        systemInstruction += `\n[NUEVO CONOCIDO]\nAún no tienes recuerdos claros de esta persona.`;
      }

      chatModel.systemInstruction = {
        role: "system",
        parts: [{ text: systemInstruction }],
      };

      const chat = chatModel.startChat({ history: chatHistory });

      const prompt = isMentioned
        ? `(Directo): ${message.content}`
        : `(Ambiental): ${message.content}`;

      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();

      MemoryManager.saveMessage(userId, "user", message.content);
      MemoryManager.saveMessage(userId, "model", responseText);

      if (chanceToLearn) {
        consolidateMemory(userId, userName, userProfile, chatHistory);
      }

      setTimeout(() => {
        isProcessing = false;
      }, 2000);
      return message.reply(responseText);
    } catch (error) {
      console.error("[Gemini Error]", error);
      isProcessing = false;
    }
  }
};

// --- FUNCIÓN DE AUTO-APRENDIZAJE ---
async function consolidateMemory(
  userId: string,
  username: string,
  currentBio: string,
  history: any[],
) {
  console.log(`[Memoria] Analizando datos de ${username}...`);

  try {
    // Convertimos el historial a texto plano para que el analista lo lea
    const conversationText = history
      .map(
        (h) => `${h.role === "user" ? "Usuario" : "Mado"}: ${h.parts[0].text}`,
      )
      .join("\n");

    const analysisPrompt = `
      Actúa como un sistema de memoria persistente (Pokedex/Diario).

      DATOS ACTUALES DEL USUARIO: "${currentBio || "Ninguno"}"

      CONVERSACIÓN RECIENTE:
      ${conversationText}

      TAREA:
      1. Extrae hechos nuevos sobre el usuario (Nombre, gustos, miedos, relaciones, proyectos).
      2. Combínalos con los DATOS ACTUALES.
      3. Elimina información redundante o trivial (como "dijo hola").
      4. Resume todo en un párrafo conciso en tercera persona.

      SALIDA (Solo el resumen actualizado):
    `;

    const result = await analysisModel.generateContent(analysisPrompt);
    const newBio = result.response.text().trim();

    if (newBio && newBio.length > 5) {
      MemoryManager.updateUserProfile(userId, username, newBio);
      console.log(`[Memoria] Perfil actualizado para ${username}: ${newBio}`);
    }
  } catch (err) {
    console.error(`[Error] No se pudo consolidar memoria:`, err);
  }
}
