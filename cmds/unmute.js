  
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');
const fs = require('fs'); 

module.exports.run = async(bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('U hebt niet de juiste rol voor deze actie.');
    // andere optie: if(message.channel.permissionsFor(message.member).hasPermission('MANAGE_MESSAGES'))
    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!toMute) return message.channel.send('specifieer een user om te muten of ID!');
    let role = message.guild.roles.find(r => r.name === "Bimi Bot muted");


    if (!role || !toMute.roles.has(role.id)) return message.channel.send(`${toMute} is niet gemuted!`);
    // return message.reply(toMute.username || toMute.user.username);

    await (toMute.removeRole(role));
    console.log(`${toMute} kan nu uit zijn hoek worden gehaald!`);
    delete bot.mutes[toMute];
    fs.writeFile('./mutes.json', JSON.stringify(bot.mutes), (err) => {
        if(err) throw err;
        console.log(`I have umuted ${toMute.user.tag}`);
    });
    message.channel.send(`${toMute} is momenteel ungemuted!`);
};

module.exports.help = {
    name: "unmute"
};