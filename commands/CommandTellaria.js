const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = class CommandSpeak {

    constructor(main) {
        this.main = main;
    }

    match(commandName){
        return (commandName.toLowerCase() == 'tellaria');
    }

    async action(interaction){
        
        const start = new ButtonBuilder()
			.setCustomId('start')
		    .setLabel('Démarrer une discussion')
			.setStyle(ButtonStyle.Success)

        const invite = new ButtonBuilder()
            .setLabel('Inviter')
            .setURL('https://hellenia.erpriex.fr')
            .setStyle(ButtonStyle.Link)

        const rowButtons = new ActionRowBuilder()
            .addComponents(start, invite);

        await interaction.reply({
            content: `Bienvenue <@` + interaction.user.id + "> 👋",
            components: [rowButtons],
        });

    }

}