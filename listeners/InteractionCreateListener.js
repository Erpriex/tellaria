const { ButtonInteraction, ChatInputCommandInteraction, ChannelType } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = class MessageCreateListener {

    constructor(main) {
        this.main = main;
    }

    onInteractionCreate() {
        this.main.bot.on('interactionCreate', async interaction => {

            if(interaction instanceof ChatInputCommandInteraction){
                if(this.main.commandTellaria.match(interaction.commandName)){
                    this.main.commandTellaria.action(interaction);
                }
            }

            if(interaction instanceof ButtonInteraction){
                if(interaction.customId === "start"){
                    if(!interaction.member.voice.channel){
                        await interaction.reply({ content: ":x: Tu dois être dans un salon vocal pour pouvoir démarrer une discussion", ephemeral: true });
                        return;
                    }
                    let targetConnection = getVoiceConnection(interaction.guildId);
                    if(targetConnection){
                        await interaction.reply({ content: ":x: Désolé je suis déjà en cours d'utilisation, chacun son tour !", ephemeral: true });
                        return;
                    }

                    const replyMessage = await interaction.reply({ content: "Démarrage de la discussion...", ephemeral: true });
                    setTimeout(async () => {
                        try {
                            await replyMessage.delete();
                        } catch (error) {
                            console.error("Impossible de supprimer le message:", error);
                        }
                    }, 10000);

                    const thread = await interaction.channel.threads.create({
                        name: 'tellaria-' + interaction.user.username,
                        autoArchiveDuration: 60,
                        type: ChannelType.PrivateThread,
                        reason: 'Discussion Tellaria',
                    });

                    await interaction.member.voice.channel.members.forEach((member) => {
                        thread.members.add(member.id);
                    })
                    
                    const connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.member.voice.channel.guild.id,
                        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                    });

                    this.main.threadsManagerTask.addConnection(interaction.guildId, thread);
                }
            }
        });
    }
}