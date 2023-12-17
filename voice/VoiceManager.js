const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const gtts = require('node-gtts')('fr');
const path = require('path');
const fs = require('fs');

module.exports = class VoiceManager {

    constructor() {
        this.soundVol = 47 / 100;
    }

    playWithCaller(fileAudioMessage, messageTarget, author, guildId){
        const player = createAudioPlayer();

        const callerFile = createAudioResource('./voice-callers/' + author.id + ".mp3", { inlineVolume: true });
        callerFile.volume.setVolume(this.soundVol);
        player.play(callerFile);
        let targetConnection = getVoiceConnection(guildId);
        const subscription = targetConnection.subscribe(player);
        player.on('stateChange', (oldState, newState) => {
            if(newState.status === 'idle'){
                player.stop();
                subscription.unsubscribe();
                this.play(fileAudioMessage, messageTarget, author, guildId, true);
            }
        });
    }

    play(fileAudioMessage, messageTarget, author, guildId, caller = false){
        const player = createAudioPlayer();

        var filepath = path.join(__dirname, fileAudioMessage);
        gtts.save(filepath, (caller ? '' : author.username) + ' à dit : ' + messageTarget, function() {
            const audioFile = createAudioResource(filepath);

            player.play(audioFile);
            let targetConnection = getVoiceConnection(guildId);
            const subscription = targetConnection.subscribe(player);
            player.on('stateChange', (oldState, newState) => {
                if(newState.status === 'idle'){
                    player.stop();
                    subscription.unsubscribe();
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                }
            });
        })
    }

}