module.exports = {
    name: 'leave',
    description: 'Leaves the voice channel that the user is in',
    guildOnly: true,
    args: false,
    usage: false,
    execute(message) {

        //Checks if the client is connected a voice channel in the same guild as the user
        if(!message.guild.voiceConnection) {
            message.reply(" I don't think I'm in a voice channel!");
            return;
        }

        //Checks if the client is connected to the same voice channel that the user is in
        if (message.guild.voiceConnection.channel !== message.member.voiceChannel) {
            message.reply(' you have to be in a voice channel with me to use this command!');
            return;
        }

        //Empties the queue and ends the connection
        if(servers[message.guild.id]){
            let server = servers[message.guild.id];
            server.queue = [];
    
            if(server.dispatcher) server.dispatcher.end();
            else message.guild.voiceConnection.end();
        }
    },
};