import { Collection } from "discord.js";

<<<<<<< HEAD
=======
// Estructura: <NombreComando, Collection<UserId, Timestamp>>
>>>>>>> cd696faafc4f943450a4d59f48802d3190c1bfde
const cooldowns = new Collection<string, Collection<string, number>>();

export const checkCooldown = (
  userId: string,
  commandName: string,
  cooldownAmount: number,
): number | null => {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(commandName)!;
  const cooldownAmountMs = cooldownAmount * 1000;

  if (timestamps.has(userId)) {
    const expirationTime = timestamps.get(userId)! + cooldownAmountMs;

    if (now < expirationTime) {
<<<<<<< HEAD
      return (expirationTime - now) / 1000;
=======
      return (expirationTime - now) / 1000; // Retorna segundos restantes
>>>>>>> cd696faafc4f943450a4d59f48802d3190c1bfde
    }
  }

  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownAmountMs);
<<<<<<< HEAD
  return null;
=======
  return null; // No hay cooldown activo
>>>>>>> cd696faafc4f943450a4d59f48802d3190c1bfde
};
