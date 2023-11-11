module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onInteractionCreate() {
        this.main.bot.on('interactionCreate', async interaction => {
            console.log(interaction);
            if(this.main.commandTellaria.match(interaction.commandName)){
                this.main.commandTellaria.action(interaction);
            }
        });
    }
}