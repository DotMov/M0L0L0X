module.exports = {
    name: 'yt-skip',
    description: 'Skips the song currently playing if there is a song next in the queue',
    guildOnly: true,
    execute(message) {

        //Check if the sender of the message is in a voice channel
        if(!message.member.voiceChannel) {
            message.reply(' you must be in a valid voice channel to use this command!');
            return;
        }

        //Check if anything is being played on that server
        if(!servers[message.guild.id])
        {
            message.reply(' there is nothing playing on this server!');
            return;
        }

        //End the current song by using the end method of the server's dispatcher
        var server = servers[message.guild.id];
        server.dispatcher.end();
        message.reply(' song has been skipped!');
    }
};
