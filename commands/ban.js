module.exports = {
    name: 'ban',
    description: 'Bans the user mentioned following the command',
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message) {

        //Checks if the user has permission to ban members
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            message.reply(' you do not have permission to use this command!');
        }

        let member = message.mentions.members.first();

        //Checks if a member was mentioned in the message. If not, exit
        if(!member) {
            message.reply(' you have to mention the user to be banned using the @ symbol!');
            return;
        }

        //If a member was mentioned in the message, ban them
        member.ban().then((member) => {
            message.channel.send(":facepalm: " + member.displayName + " has been banned!");
        }).catch(() => {
            message.channel.send("Error!");
        });
    },
};