module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onInteractionCreate() {
        this.main.bot.on('interactionCreate', async interaction => {
            console.log(interaction);
            if (interaction.commandName === 'speak') {
                await interaction.reply('Pong!');
            }
        });
    }
}