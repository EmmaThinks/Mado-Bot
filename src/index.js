"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emma = exports.commands = void 0;
var discord_js_1 = require("discord.js");
var dotenv = require("dotenv");
var fs = require("fs");
var path = require("path");
var url_1 = require("url");
var cdmanager_js_1 = require("./interfaces/cdmanager.js");
var IntelligenceManager_js_1 = require("./interfaces/IntelligenceManager.js");
dotenv.config();
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path.dirname(__filename);
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
});
exports.commands = new discord_js_1.Collection();
exports.emma = "1154267431053840414";
var token = process.env.TOKEN;
var preFix = "mado";
var loadCommands = function () { return __awaiter(void 0, void 0, void 0, function () {
    var foldersPath, commandFolders, _i, commandFolders_1, folder, commandsPath, commandFiles, _a, commandFiles_1, file, filePath, commandImport, command, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                foldersPath = path.join(__dirname, "commands");
                commandFolders = fs.readdirSync(foldersPath);
                _i = 0, commandFolders_1 = commandFolders;
                _b.label = 1;
            case 1:
                if (!(_i < commandFolders_1.length)) return [3 /*break*/, 8];
                folder = commandFolders_1[_i];
                commandsPath = path.join(foldersPath, folder);
                commandFiles = fs
                    .readdirSync(commandsPath)
                    .filter(function (file) { return file.endsWith(".js"); });
                _a = 0, commandFiles_1 = commandFiles;
                _b.label = 2;
            case 2:
                if (!(_a < commandFiles_1.length)) return [3 /*break*/, 7];
                file = commandFiles_1[_a];
                filePath = path.join(commandsPath, file);
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, Promise.resolve("".concat((0, url_1.pathToFileURL)(filePath).href)).then(function (s) { return require(s); })];
            case 4:
                commandImport = _b.sent();
                command = commandImport.command;
                if (command && "name" in command && "run" in command) {
                    command.category = folder.toLowerCase();
                    exports.commands.set(command.name, command);
                    console.log("Comando cargado: ".concat(command.name, " [").concat(folder, "]"));
                }
                else {
                    console.log("".concat(file, " no tiene la estructura correcta."));
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error("\u274C Error cargando ".concat(file, ":"), error_1);
                return [3 /*break*/, 6];
            case 6:
                _a++;
                return [3 /*break*/, 2];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}); };
client.on("messageCreate", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var args, commandName, command, timeLeft, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (message.author.bot)
                    return [2 /*return*/];
                if (!!message.content.toLowerCase().startsWith(preFix)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, IntelligenceManager_js_1.handlePassiveInteractions)(message)];
            case 1: return [2 /*return*/, _b.sent()];
            case 2:
                args = message.content.slice(preFix.length).trim().split(/ +/);
                commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                if (!commandName)
                    return [2 /*return*/];
                command = exports.commands.get(commandName);
                if (!command)
                    return [2 /*return*/];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                timeLeft = (0, cdmanager_js_1.checkCooldown)(message.author.id, command.name, command.cooldown || 3);
                if (timeLeft) {
                    return [2 /*return*/, message.reply("Calmate animal ".concat(timeLeft.toFixed(1), "s m\u00E1s antes de usar `").concat(command.name, "`, por el bien del plan gratuito."))];
                }
                return [4 /*yield*/, command.run(message, args)];
            case 4:
                _b.sent();
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error(error_2);
                message.reply("Hubo un error ejecutando ese comando, pidele a emma que lo arregle plz.");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
loadCommands().then(function () {
    client.login(token);
});
