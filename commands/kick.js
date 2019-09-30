module.exports = {
    name: 'kick',
    description: 'Kicks the user mentioned following the command',
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message, args) {

        if (!message.member.hasPermission('KICK_MEMBERS')) {
            message.reply(" DOES NOT HAVE PERMISSION TO USE THIS COMMAND");
        }

        let member = message.mentions.members.first();
        member.kick().then((member) => {
            message.channel.send(":wave: " + member.displayName + " HAS BEEN KICKED");
        }).catch(() => {
            message.channel.send("ERROR!");
        });
    },
};