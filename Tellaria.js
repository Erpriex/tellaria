try{
    require("./config.json");
}catch(e){
    console.error("Le fichier de configuration n'est pas présent.")
    return;
}
const config = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });

const CommandSpeak = require('./commands/CommandSpeak');

bot.on('ready', () => {
    console.log("Bot ready !");
});

bot.on('messageCreate', (message) => {
    if(message.channel.type == 1) return; // DM_CHANNEL
    if(message.author.bot) return;

    if(!message.content.startsWith(config.commandPrefix) || message.content.length <= config.commandPrefix.length) return;

    let command = message.content.slice(1);
    
    if(CommandSpeak.match(command)){
        CommandSpeak.action(message);
    }
});

bot.login(config.token);