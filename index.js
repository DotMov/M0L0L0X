const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    //set a new item in the Collection
    //with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

global.servers = {};

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    console.log(message.createdAt + ' ' + message.author.username + ': ' + message.content);

    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    //If the given command cannot be found, the message will be checked for command aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    //Checks if command is only usable inside a text channel 
    //and replies with an error message if the message is used in anything but a text channel
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('That command cannot be executed inside of Direct Messages!');
    }

    //Checks if command requires arguments
    //and replies with an error message if the user provided incorrect or no arguments
    if (command.args && !args.length) {
        let reply = `You did not provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command!`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error)
        message.reply("There was an error trying to execute that command! Sorry!");
    }

})

client.login(token);