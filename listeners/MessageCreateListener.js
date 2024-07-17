const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const request = require('request');

module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onMessageCreate() {
        this.main.bot.on('messageCreate', (message) => {
            if(message.author.bot) return;
            if(message.channel.type == 1) return; // DM

            if(message.channel.type == 12){
                if(message.channel.name.startsWith('tellaria-') && this.main.threadsManagerTask.connectionExists(message.guild.id)){
                    this.main.threadsManagerTask.resetTimer(message.guild.id);
                    let msgTarget = message.content;

                    if(msgTarget.length > 250){
                        message.channel.send(":x: Désolé, je n'ai pas encore assez pris mon souffle pour pouvoir parler autant !");
                        return;
                    }

                    let regexMention = "<@!?[0-9]+>";
                    msgTarget = msgTarget.replace(new RegExp(regexMention, 'g'), (match) => {
                        let userId = match.replace(/<@!?/, '').replace('>', '');
                        let user = message.guild.members.cache.get(userId);
                        let userRes = "";
                        try{
                            userRes = user ? user.displayName : "utilisateur inconnu";
                        }catch{
                            userRes = "utilisateur inconnu";
                        }
                        return userRes;
                    });

                    let regexUrl = "https?://(?:www\\.)?[a-zA-Z0-9-]+(?:\\.[a-zA-Z]{2,})+(?:\/[^\\s]*)?";
                    msgTarget = msgTarget.replace(new RegExp(regexUrl, 'g'), "lien");

                    let regexChannel = "<#?[0-9]+>";
                    msgTarget = msgTarget.replace(new RegExp(regexChannel, 'g'), (match) => {
                        let channelId = match.replace(/<#?/, '').replace('>', '');
                        let channel = message.guild.channels.cache.get(channelId);
                        let channelRes = "salon ";
                        try{
                            channelRes += channel ? channel.name : "";
                        }catch{
                            // Do nothing
                        }
                        return channelRes;
                    });

                    let regexEmote = "<a?:[a-zA-Z0-9_]+:[0-9]+>";
                    msgTarget = msgTarget.replace(new RegExp(regexEmote, 'g'), (match) => {
                        let emoteId = match.replace(/<a?:[a-zA-Z0-9_]+:/, '').replace('>', '');
                        let emote = message.guild.emojis.cache.get(emoteId);
                        let emoteRes = "émoji ";
                        try{
                            emoteRes += emote ? emote.name : "";
                        }catch{
                            // Do nothing
                        }
                        return emoteRes;
                    });

                    let voiceInstance = this.main.voiceManager;

                    request.get(this.main.config.apiUrl + '/tellaria/phonetic/' + message.author.id, {}, function (error, response, body) {
                        let requestError = false;
                        let phonetic = message.author.username;
                        if(error) {
                            requestError = true;
                            console.log(error);
                        }else if(response.statusCode == 200){
                            let res = JSON.parse(body);
                            phonetic = res.message;
                        }

                        if(fs.existsSync('./voice-in/' + message.author.id + ".mp3")){
                            voiceInstance.playWithCaller(message.author.id + ".mp3", msgTarget, message.author, message.guild.id);
                        }else{
                            voiceInstance.play(message.author.id + ".mp3", msgTarget, message.author, message.guild.id, phonetic);
                        }
                    });
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