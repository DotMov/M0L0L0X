module.exports = {
    name: 'leave',
    description: 'Leaves the voice channel that the user is in',
    guildOnly: true,
    args: false,
    usage: false,
    execute(message, args) {

        if (message.guild.voiceConnection.channel !== message.member.voiceChannel) {
            message.reply('WE MUST BE IN A VALID VOICE CHANNEL TOGETHER TO USE THIS COMMAND');
            return;
        }

        if(servers[message.guild.id]){
            let server = servers[message.guild.id];
            server.queue = [];
    
            server.dispatcher.end();
        }
    },
};