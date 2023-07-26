module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onMessageCreate() {
        this.main.bot.on('messageCreate', (message) => {
            if(message.channel.type == 1) return; // If DM_CHANNEL
            if(message.author.bot) return;
        
            if(!message.content.startsWith(this.main.config.commandPrefix) || message.content.length <= this.main.config.commandPrefix.length) return;
        
            let commandName = message.content.slice(1)[0];
            
            if(this.main.commandSpeak.match(commandName)){
                return this.main.commandSpeak.action(message);
            }
        });
    }
}