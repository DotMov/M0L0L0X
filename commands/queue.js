const ytdl = require('ytdl-core');

module.exports = {
    name: 'queue',
    description: 'Responds with a message containing the entire music queue (if there is one)',
    guildOnly: true,
    async execute(message) {

        if(!message.guild.voiceConnection)
        {
            message.reply(' there is no music currently playing!');
            return;
        }

        var title;
        var results = "";

        for(i = 0; i < servers[message.guild.id].queue.length; i++)
        {
            try {
                let info = await ytdl.getInfo(servers[message.guild.id].queue[i]);
                title = info.title;
            }
            catch {
                title = "Unable to find the title of this video! Likely because it's blocked by the copyright holder.";
            }

            results += `\n${i+1}. ${title}`;
        }

        message.reply(results);
    },
}