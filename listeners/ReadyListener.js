module.exports = class ReadyListener {

    constructor(main) {
        this.main = main;
    }

    onReady() {
        this.main.bot.on('ready', () => {
            console.log("Bot ready !");
        });   
    }
}