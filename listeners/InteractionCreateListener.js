const { ButtonInteraction, ChatInputCommandInteraction, ChannelType } = require("discord.js");

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
                    interaction.deferUpdate();
                    const thread = await interaction.channel.threads.create({
                        name: 'tellaria-' + interaction.user.username,
                        autoArchiveDuration: 60,
                        type: ChannelType.PrivateThread,
                        reason: 'Discussion Tellaria',
                    });

                    await thread.members.add(interaction.user.id);
                }
            }
        });
    }
}