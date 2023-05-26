module.exports = class CommandSpeak {

    static match(command){
        return (command.toLowerCase() == 'speak' || args[0].toLowerCase() == 's');
    }

    static action(message){
        
    }

}