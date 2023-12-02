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
                    let targetConnection = getVoiceConnection(interaction.guildId);
                    if(!interaction.member.voice.channel){
                        await interaction.reply({ content: ":x: Tu dois être dans un salon vocal pour pouvoir démarrer une discussion", ephemeral: true });
                        return;
                    }
                    interaction.deferUpdate();
                    const thread = await interaction.channel.threads.create({
                        name: 'tellaria-' + interaction.user.username,
                        autoArchiveDuration: 60,
                        type: ChannelType.PrivateThread,
                        reason: 'Discussion Tellaria',
                    });

                    await thread.members.add(interaction.user.id);
                    
                    const connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.member.voice.channel.guild.id,
                        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                    });
                }
            }
        });
    }
}