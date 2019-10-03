
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const ytpl = require('ytpl');
const ytlist = require('youtube-playlist');

async function play(connection, message) {
    var server = servers[message.guild.id];
    try {
        server.dispatcher = connection.playOpusStream(await ytdlDiscord(server.queue[0], { filter: 'audioonly', highWaterMark: 1 << 25 }));
    }
    catch {
        var title;
        try {
            let info = await ytdl.getInfo(server.queue[0]);
            title = info.title;
        }
        catch {
            title = "Unable to find the title of this video! Likely because it's blocked by the copyright holder.";
        }
        message.channel.send(`There was an error trying to play this video! Skipped! \n${title}`);
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
    }
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
    execute(message, args) {

        console.log('Starting new run!');

        //Check if the author of the message is in a voice channel
        //If not, reply with an error message and return
        if (!message.member.voiceChannel) {
            message.reply(' you must be in a valid voice channel to use this command!');
            return;
        }

        //Check if the argument is a playlist. If it is, add the urls
        //of the videos of the playlist to the beginning of the args array
        //If not, check if it is a video
        let playlistValidate = ytpl.validateURL(args[0]);
        if (playlistValidate) {
            let playlistURL = args.shift();
            //let results = ytlist(playlistURL, 'url');
            ytlist(playlistURL, 'url').then(results => {
                args = results.data.playlist.concat(args);
                console.log("Playlist parsed");
                if (args[0]) this.execute(message, args);
                return;
            });
        }
        else {
            //Check if the argument is a valid video
            //If invalid, reply with an error message 
            //and recursively call the command with the rest of the arguments
            //If there are no more arguments, return
            let validate = ytdl.validateURL(args[0]);
            if (validate) {
                console.log("Video validated");

                //Check if the client is already connected to the guild
                //If not, then connect and create a server entry, initializing the queue
                //Put the first argument on the queue and play it
                //If there are any more arguments, recursively call the command
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join()
                        .then(connection => {
                            message.reply(" channel successfully joined!");
                            console.log("Channel joined");
                            if (!servers[message.guild.id]) {
                                servers[message.guild.id] = { queue: [] };
                                console.log("Queue created");
                                let server = servers[message.guild.id];
                                server.queue.push(args.shift());
                                console.log("First song added to queue");
        
                                play(connection, message);
        
                                if (args[0]) this.execute(message, args);
                            }
                        });
                }
                //If the client is already connected to the guild,
                //pop the next argument off and add it to the queue
                //If there are any more arguments, recursively call the command
                else {
                    let server = servers[message.guild.id];
                    console.log(`${args[0]} being added to the queue`);
                    server.queue.push(args.shift());
                    if (args[0]) {
                        this.execute(message, args);
                    }
                    else {
                        message.reply(' valid link(s) added to the queue!');
                        console.log('Links finished being added');
                    }
                }
            }
            else {
                message.reply(`${args[0]} is either not a valid youtube URL or is not supported! Unable to add to queue.`);
                args.shift();
                if (args[0]) this.execute(message, args);
                return;
            }
        }
    },
};