const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onMessageCreate() {
        this.main.bot.on('messageCreate', (message) => {
            if(message.author.bot) return;
            if(message.channel.type == 1) return; // DM

            if(message.channel.type == 12){
                if(message.channel.name.startsWith('tellaria-')){
                    let msgTarget = message.content;

                    if(msgTarget.length > 250){
                        message.channel.send(":x: Désolé, je n'ai pas encore assez pris mon souffle pour pouvoir parler autant !");
                        return;
                    }

                    if(fs.existsSync('./voice-callers/' + message.author.id + ".mp3")){
                        this.main.voiceManager.playWithCaller(message.author.id + ".mp3", msgTarget, message.author, message.guild.id);
                    }else{
                        this.main.voiceManager.play(message.author.id + ".mp3", msgTarget, message.author, message.guild.id);
                    }
                }
            }

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