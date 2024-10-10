const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const gtts = require('node-gtts')('fr');
const path = require('path');
const fs = require('fs');

module.exports = class VoiceManager {

    constructor() {
        this.soundVol = 25 / 100;
    }

    playWithCaller(fileAudioMessage, messageTarget, author, guildId){
        const player = createAudioPlayer();

        const callerFile = createAudioResource('./voice-in/' + author.id + ".mp3", { inlineVolume: true });
        callerFile.volume.setVolume(this.soundVol);
        player.play(callerFile);
        let targetConnection = getVoiceConnection(guildId);
        const subscription = targetConnection.subscribe(player);
        player.on('stateChange', (oldState, newState) => {
            if(newState.status === 'idle'){
                player.stop();
                subscription.unsubscribe();
                this.play(fileAudioMessage, messageTarget, author, guildId, null, true);
            }
        });
    }

    play(fileAudioMessage, messageTarget, author, guildId, phonetic, caller = false, withoutPrefix = false){
        const player = createAudioPlayer();

        var filepath = path.join(__dirname, fileAudioMessage);

        let prefix = withoutPrefix ? '' : '"De ' + phonetic + '" ';

        gtts.save(filepath, (caller ? '' : prefix) + messageTarget, function() {
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