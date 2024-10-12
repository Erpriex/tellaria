const { getVoiceConnection } = require('@discordjs/voice');

module.exports = class VoiceStateUpdateListener {

    constructor(main) {
        this.main = main;
    }

    onVoiceStateUpdate() {
        this.main.bot.on('voiceStateUpdate', (oldState, newState) => {
            if (newState.channelId && !oldState.channelId) { // Join
                const member = newState.member;
                const guildId = member.guild.id;
                if(member.id === this.main.bot.user.id){
                    return;
                }
                let targetConnection = getVoiceConnection(guildId);
                if (!targetConnection) {
                    return;
                }

                if (newState.channel.members.has(this.main.bot.user.id)) {
                    this.main.threadsManagerTask.getThread(guildId).members.add(member.id);
                }
            }

            if (!newState.channelId && oldState.channelId) { // Leave
                const member = oldState.member;
                const guildId = member.guild.id;
                if(member.id === this.main.bot.user.id){
                    return;
                }
                if (oldState.channel.members.has(this.main.bot.user.id)) {
                    this.main.threadsManagerTask.getThread(guildId).members.remove(member.id);
                }
            }
        });
    }

}