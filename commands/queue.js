const ytdl = require('ytdl-core');

module.exports = {
    name: 'queue',
    description: 'Responds with a message containing the entire music queue (if there is one)',
    guildOnly: true,
    async execute(message, args) {

        if(!message.guild.voiceConnection)
        {
            message.reply(' there is no music currently playing!');
            return;
        }

        var titles = [];
        var results = "";

        for(i = 0; i < servers[message.guild.id].queue.length; i++)
        {
            let info = await ytdl.getInfo(servers[message.guild.id].queue[i]);
            results += `\n${i+1}. ${info.title}`;
        }

        message.reply(results);
    },
}