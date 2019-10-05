const ytdl = require('ytdl-core');

module.exports = {
    name: 'queue',
    description: 'Responds with a message containing the entire music queue (if there is one)',
    guildOnly: true,
    execute(message) {

        if(!message.guild.voiceConnection)
        {
            message.reply(' there is no music currently playing!');
            return;
        }

        var results = "";

        Promise.all(servers[message.guild.id].queue.map(url => {
            return ytdl.getInfo(url).then(info => {
                return info.title;
            }).catch(error => {
                console.log(`Unable to find title of video: ${error}`);
                return "Unable to find the title of this video! Likely because it's blocked by the copyright holder.";
            })
        })).then(titles => {
            titles.forEach( (title, index) => {
                results += `\n${index+1}. ${title}`;
            })
            message.reply(results);
        }).catch(error => {
            console.log(error);
            message.reply(" there was an error when trying to build the queue list! Sorry!");
        });
    },
}