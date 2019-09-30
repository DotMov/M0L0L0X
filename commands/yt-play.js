
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');

async function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playOpusStream(await ytdlDiscord(server.queue[0], { filter: 'audioonly', highWaterMark: 1 << 25 }));
    server.dispatcher.on("end", function () {
        server.queue.shift();
        if (server.queue[0]) {
            play(connection, message);
        }
        else {
            delete server.queue;
            delete servers[message.guild.id];
            server.dispatcher.end();
            connection.disconnect();
        }
    });
}

module.exports = {
    name: 'yt-play',
    description: 'Plays the audio of a provided youtube video in the channel that the user is in',
    guildOnly: true,
    args: true,
    usage: '<url>',
    async execute(message, args) {

        //Check if the author of the message is in a voice channel
        //If not, reply with an error message and return
        if (!message.member.voiceChannel) {
            message.reply(' you must be in a valid voice channel to use this command!');
            return;
        }

        //Validate the first url in the message
        //If invalid, reply with an error message 
        //and recursively call the command with the rest of the arguments
        //If there are no more arguments, return
        let validate = await ytdl.validateURL(args[0]);
        if (!validate) {
            message.reply( `${args[0]} is either not a valid youtube URL or is not supported! Unable to add to queue.`);
            args.shift();
            if(args[0]) this.execute(message, args);
            return;
        }

        //Check if the client is already connected to the guild
        //If not, then connect and create a server entry, initializing the queue
        //Put the first argument on the queue and play it
        //If there are any more arguments, recursively call the command
        if (!message.guild.voiceConnection) {
            message.member.voiceChannel.join()
                .then(connection => {
                    message.reply(" channel successfully joined!");
                    if (!servers[message.guild.id]) {
                        servers[message.guild.id] = { queue: []};
                        let server = servers[message.guild.id];
                        server.queue.push(args.shift());
                        play(connection, message);

                        if(args[0]) this.execute(message, args);
                    }
                });
        }
        //If the client is already connected to the guild,
        //pop the next argument off and add it to the queue
        //If there are any more arguments, recursively call the command
        else{
            let server = servers[message.guild.id];
            server.queue.push(args.shift());
            if(args[0]) this.execute(message, args);
            else message.reply(' valid link(s) added to the queue!');
        }
    },
};