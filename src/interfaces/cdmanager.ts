import { Collection } from "discord.js";

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
      return (expirationTime - now) / 1000;
    }
  }

  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownAmountMs);
  return null;
};
