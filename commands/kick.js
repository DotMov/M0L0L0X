module.exports = {
    name: 'kick',
    description: 'Kicks the user mentioned following the command',
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message, args) {

        if (!message.member.hasPermission('KICK_MEMBERS')) {
            message.reply(" you do not have permission to use this command!");
        }

        let member = message.mentions.members.first();
        member.kick().then((member) => {
            message.channel.send(":wave: " + member.displayName + " has been kicked!");
        }).catch(() => {
            message.channel.send("Error!");
        });
    },
};