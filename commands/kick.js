module.exports = {
    name: 'kick',
    description: 'Kicks the user mentioned following the command',
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message) {

        //Checks if the user has permission to kick members
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            message.reply(" you do not have permission to use this command!");
        }

        let member = message.mentions.members.first();

        //Checks if a member was mentioned in the message. If not, tell the user and exit
        if(!member) {
            message.reply(" you have to mention the user to be kicked using the @ symbol!");
            return;
        }

        //If a member was mentioned, kick them
        member.kick().then((member) => {
            message.channel.send(":wave: " + member.displayName + " has been kicked!");
        }).catch(() => {
            message.channel.send("Error!");
        });
    },
};