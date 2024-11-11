module.exports = class UsersJingleCooldownTask {
    
    constructor() {
        this.users = new Map();
        this.start = this.start.bind(this);
        this.run = this.run.bind(this);
        this.start();
        this.defaultTimer = 180;
    }

    start(){
        setInterval(this.run, 1000);
    }

    run() {
        this.users.forEach((value, key) => {
            if(value <= 0){
                this.users.delete(key);
            }else{
                this.users.set(key, value - 1);
            }
        });
    }

    addUser(userId){
        this.users.set(userId, this.defaultTimer);
    }

    removeUser(userId){
        this.users.delete(userId);
    }

    resetTimer(userId){
        this.users.set(userId, this.defaultTimer);
    }

    userExists(userId){
        return this.users.has(userId);
    }

}