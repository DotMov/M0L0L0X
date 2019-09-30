module.exports = {
    name: 'ban',
    description: 'Bans the user mentioned following the command',
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message, args) {

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            message.reply(' DOES NOT HAVE PERMISSION TO USE THIS COMMAND');
        }

        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        let member = message.mentions.members.first();
        member.ban().then((member) => {
            message.channel.send(":facepalm: " + member.displayName + " HAS BEEN BANNED");
        }).catch(() => {
            message.channel.send("ERROR!");
        });
    },
};