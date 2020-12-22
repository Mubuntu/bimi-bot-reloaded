// var async = require('asyncawait/async');
// var await = require('asyncawait/await');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    try {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('U hebt niet de juiste rol voor deze actie.');
        // andere optie: if(message.channel.permissionsFor(message.member).hasPermission('MANAGE_MESSAGES'))
        console.log(message)
        console.log(message.mentions.users.first())
        // let toMute = message.mentions.users.first(); 
        let toMute = message.mentions.members.first() || await bot.users.cache.fetch(u => u.username === args[0])
        //  await message.guild.members.fetch(user => user.username === args[0])
        console.log(toMute)
        // let toMute = message.guild.members.fetch(message.mentions.users.first()) || message.guild.members.get(args[0]);

        if (toMute != undefined && toMute.id === message.author.id) return message.channel.send('ge kunt uzelf niet muten foemp!');

        if (toMute.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(`${message.author.username} heeft een hogere rol dan gij, you have no power here!`);

        if (!toMute) return message.channel.send('specifieer een user om te muten of ID!');
        let role = message.guild.roles.cache.find(r => r.name === "Muted");
        if (!role) {

            role = await (message.guild.roles.create({
                data: {
                    name: "Muted",
                    color: "#FFFFF",
                    permissions: []
                }
            }));
            message.guild.channels.forEach(async (channel, id) => {
                await (channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                }));
            });

        }

        if (toMute.roles.cache.some(r => r === role.id)) return message.channel.send(`${toMute} is al gemuted!`);
        // return message.reply(toMute.username || toMute.user.username);

        console.log(` uitput: ${args[2]}   andere ` + args[1]);
        bot.mutes[toMute.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args[1]) * 60 * 1000 // mute for ten seconds
        };
        //schrijf de mutee naar de lijst
        fs.writeFile('./mutes.json', JSON.stringify(bot.mutes, null, 4), err => {
            if (err) throw err;
            if (parseInt(args[1]))
                message.channel.send(`${toMute } is nu muted tot ${new Date(bot.mutes[toMute.id].time).toLocaleString()}`);
        });
        await (toMute.roles.add(role));
        message.channel.send(`${toMute} is momenteel gemuted!`);
    } catch (e) {
        console.log(e.stack);
    }
};

module.exports.help = {
    name: "mute"
};