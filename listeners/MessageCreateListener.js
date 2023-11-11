module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onMessageCreate() {
        this.main.bot.on('messageCreate', (message) => {
            if(message.author.bot) return;
            if(message.channel.type == 1) return; // DM
        });
    }
}