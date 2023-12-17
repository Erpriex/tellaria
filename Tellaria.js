const { REST, Routes, Client, GatewayIntentBits, ActivityType } = require('discord.js');

const CommandTellaria = require('./commands/CommandTellaria');

const InteractionCreateListener = require('./listeners/InteractionCreateListener');
const MessageCreateListener = require('./listeners/MessageCreateListener');
const ReadyListener = require('./listeners/ReadyListener');

const VoiceManager = require('./voice/VoiceManager');

class Tellaria {

    async start(){
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
                GatewayIntentBits.GuildVoiceStates
            ],
        });

        this.bot.login(this.config.token);

        this.commandTellaria = new CommandTellaria(this);

        this.interactionCreateListener = new InteractionCreateListener(this);
        this.interactionCreateListener.onInteractionCreate();
        this.messageCreateListener = new MessageCreateListener(this);
        this.messageCreateListener.onMessageCreate();
        this.readyListener = new ReadyListener(this);
        this.readyListener.onReady();

        this.voiceManager = new VoiceManager();
    }

    async updateApplicationCommands(){
        const commands = [
            {
              name: 'tellaria',
              description: 'Démarrer avec Tellaria',
            },
        ];

        const rest = new REST({ version: '10' }).setToken(this.config.token);

        try {
            console.log('Started refreshing application (/) commands.');
          
            await rest.put(Routes.applicationCommands(this.config.applicationId), { body: commands });
          
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    updatePresence(){
        if(this.config.devMode){
            this.bot.user.setPresence({
                activities: [{ name: `son développement`, type: ActivityType.Watching }],
                status: 'dnd',
            });
        }else{
            this.bot.user.setPresence({
                activities: [{ name: `les mutes`, type: ActivityType.Listening }],
                status: 'online',
            });
        }
    }

}

new Tellaria().start();