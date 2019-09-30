module.exports = {
    name: 'ban',
    description: 'Bans the user mentioned following the command',
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message, args) {

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            message.reply(' you do not have permission to use this command!');
        }

        let member = message.mentions.members.first();
        member.ban().then((member) => {
            message.channel.send(":facepalm: " + member.displayName + " has been banned!");
        }).catch(() => {
            message.channel.send("Error!");
        });
    },
};