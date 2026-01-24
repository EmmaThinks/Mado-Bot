"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCooldown = void 0;
var discord_js_1 = require("discord.js");
var cooldowns = new discord_js_1.Collection();
var checkCooldown = function (userId, commandName, cooldownAmount) {
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new discord_js_1.Collection());
    }
    var now = Date.now();
    var timestamps = cooldowns.get(commandName);
    var cooldownAmountMs = cooldownAmount * 1000;
    if (timestamps.has(userId)) {
        var expirationTime = timestamps.get(userId) + cooldownAmountMs;
        if (now < expirationTime) {
            return (expirationTime - now) / 1000;
        }
    }
    timestamps.set(userId, now);
    setTimeout(function () { return timestamps.delete(userId); }, cooldownAmountMs);
    return null;
};
exports.checkCooldown = checkCooldown;
