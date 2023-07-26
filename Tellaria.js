const { Client, GatewayIntentBits } = require('discord.js');

const CommandSpeak = require('./commands/CommandSpeak');

const MessageCreateListener = require('./listeners/MessageCreateListener');
const ReadyListener = require('./listeners/ReadyListener');

class Tellaria {

    start(){
        try{
            require("./config.json");
        }catch(e){
            console.error("Le fichier de configuration n'est pas présent.")
            return;
        }
        this.config = require('./config.json');

        this.bot = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });

        this.bot.login(this.config.token);

        this.commandSpeak = new CommandSpeak(this);

        this.messageCreateListener = new MessageCreateListener(this);
        this.messageCreateListener.onMessageCreate();
        this.readyListener = new ReadyListener(this);
        this.readyListener.onReady();
    }

}

new Tellaria().start();