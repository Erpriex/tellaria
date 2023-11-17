module.exports = class VoiceUtils {

    static checkVoiceConnection(memberId){
        const voiceConnection = this.main.bot.voice.connections.find(connection => connection.channel.members.find(member => member.id == memberId));
        if(voiceConnection){
            return voiceConnection;
        }else{
            return false;
        }
    }

}