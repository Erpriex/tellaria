const { getVoiceConnection } = require('@discordjs/voice');

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
                let targetConnection = getVoiceConnection(key);
                targetConnection.disconnect();
                thread.delete();
                this.connections.delete(key);
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

}