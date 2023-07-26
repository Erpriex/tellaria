const Tellaria = require('../Tellaria');

module.exports = class CommandSpeak {

    constructor(main) {
        this.main = main;
    }

    match(commandName){
        return (commandName.toLowerCase() == 'speak' || commandName.toLowerCase() == 's');
    }

    action(message){
        let args = message.content.split(' ').slice(1);

        let botGuildMember = message.guild.members.cache.get(this.main.bot.user.id);

        if(!botGuildMember.hasPermission('SEND_MESSAGES')){
            return;
        }

        if(!message.member.voice.channel){
            message.channel.send("Tu dois être dans un salon vocal");
            if(botGuildMember.permissions.has('ADD_REACTIONS')){
                message.react('❌');
            }
            return;
        }
    }

}