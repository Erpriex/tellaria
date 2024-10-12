const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');

module.exports = class ThreadsManagerTask {

    constructor() {
        this.connections = new Map();
        this.start = this.start.bind(this);
        this.run = this.run.bind(this);
        setTimeout(this.start, 5000);
        this.defaultTimer = 900;
    }

    start(){
        setInterval(this.run, 1000);
    }

    run() {
        this.connections.forEach((value, key) => {
            if(value[1] <= 0){
                let thread = value[0];

                thread.delete();
                this.connections.delete(key);

                const player = createAudioPlayer();
                const leaveAudio = createAudioResource("./voice-in/au_revoir.mp3", { inlineVolume: true });
                player.play(leaveAudio);
                let targetConnection = getVoiceConnection(key);
                const subscription = targetConnection.subscribe(player);
                player.on('stateChange', (oldState, newState) => {
                    if(newState.status === 'idle'){
                        player.stop();
                        subscription.unsubscribe();
                        targetConnection.disconnect();
                        targetConnection.destroy();
                    }
                });
            }else{
                value[1]--;
            }
        });
    }

    addConnection(guildId, thread){
        this.connections.set(guildId, [thread, this.defaultTimer]);
    }

    removeConnection(guildId){
        this.connections.delete(guildId);
    }

    resetTimer(guildId){
        this.connections.get(guildId)[1] = this.defaultTimer;
    }

    connectionExists(guildId){
        return this.connections.has(guildId);
    }

    getThread(guildId){
        return this.connections.get(guildId)[0];
    }

}