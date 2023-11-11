const { EmbedBuilder } = require('discord.js');

module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onMessageCreate() {
        this.main.bot.on('messageCreate', (message) => {
            if(message.author.bot) return;
            if(message.channel.type == 1) return; // DM

            if(message.content.startsWith("-speak ") || message.content.startsWith("-s ")){ // For V1 users
                const oldUsers = new EmbedBuilder()
                    .setAuthor({name: 'Salut ancien utilisateur 👋', iconURL: this.main.bot.user.avatarURL(),})
                    .setColor('#3aa675')
                    .addFields({ name: 'Mon utilisation a changée !', value: 'Utilise à présent la commande `/tellaria` pour intéragir avec moi', inline: false })
                message.channel.send({ embeds: [oldUsers] });
            }
        });
    }
}