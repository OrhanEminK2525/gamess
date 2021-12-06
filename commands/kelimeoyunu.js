const { Client, Message, MessageEmbed } = require("discord.js");
const { JsonDatabase } = require("wio.db");

module.exports = {
	name: 'kelime',
    aliases: ['kelimeturetmece', 'kelime-oyun', 'kelime-oyunu'],
	description: `Kelime Oyunu`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String} args 
     */
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')){
            message.reply('Bu komutu kullanmak için `YÖNETİCİ` yetkisine sahip olmalısınız.')
            .then(msg => {
                msg.delete({ timeout: 5000 })
            });
            return;
        }

        const basariliEmbed = new MessageEmbed({
            title: "Kelime Oyunu (Başarılı)",
            color: "GREEN",
            footer: {
                text: client.config.footer
            }
        });

        const basarisizEmbed = new MessageEmbed({
            title: "Kelime Oyunu (Başarısız)",
            color: "RED",
            footer: {
                text: client.config.footer
            }
        });
        let prefix = client.config.prefix;

        const hata = new MessageEmbed({
            title: "Kelime Oyunu (Yardım)",
            color: "LIGHT_GREY",
            footer: {
                text: client.config.footer
            },
            description: `
**${prefix}kelimeturetmece kanal [<kanal>]** => \`Kelime Oyunu kanalını ayarlar.\`
**${prefix}kelimeturetmece başlat** => \`Kelime Oyunu ayarlanmış kanalda başlatır.\`
**${prefix}kelimeturetmece durdur** => \`Kelime Oyununu durdurur.\`
**${prefix}kelimeturetmece sıfırla** => \`Kelime Oyununu sıfırlar.\`
            `
        });
        let sistemDB = new JsonDatabase({
            databasePath: "database/sistemDB"
        });

        switch (String(args[0]).toLowerCase()) {
            case 'kanal':
                let kelimeChannel = message.mentions.channels.first();
                if(kelimeChannel != null) {
                    sistemDB.set(`${message.guild.id}.kelimeoyun.kanal`, kelimeChannel.id);
                    sistemDB.set(`${message.guild.id}.kelimeoyun.durum`, 'Başlamamış');
                    basariliEmbed.setDescription(`
Başarıyla kelime oyunu kanalı ayarlandı!

> Kanal: ${kelimeChannel}
> Oyunu başlatmak için: \`${prefix}kelimeturetmece başlat\`
                    `)
                    message.reply({ embeds: [basariliEmbed] })
                } else {
                    message.reply({ content: ":x: Geçersiz kanal", embeds: [hata] })
                }
                break;
            case 'başlat':
                let channel = message.guild.channels.cache.get(sistemDB.fetch(`${message.guild.id}.kelimeoyun.kanal`));
                if(sistemDB.fetch(`${message.guild.id}.kelimeoyun.durum`) == "Başladı") return message.reply("Kelime oyunu zaten devam ediyor.");
                if(channel != null) {
                    sistemDB.set(`${message.guild.id}.kelimeoyun.durum`, 'Başladı');
                    let harf = client.harfler[Math.floor(Math.random() * client.harfler.length)];
                    basariliEmbed.setDescription(`
Başarıyla kelime oyunu ${channel} kanalında başlatıldı.

> İlk harf: \`${harf}\`
                    `)
                    message.channel.send({ embeds: [basariliEmbed] });
                    sistemDB.set(`${message.guild.id}.kelimeoyun.sonharf`, harf);
                    basariliEmbed.setDescription(`
Kelime Oyunu başladı.

> İlk harf: \`${harf}\`
                    `)

                    channel.send({ embeds: [basariliEmbed] })
                } else {
                    basarisizEmbed.setDescription(`
Kelime oyunu kanalı ayarlanmamış!

> Ayarlamak için: \`${prefix}kelimeturetmece kanal [<kanal>]\`
                    `)
                    message.reply({ embeds: [basarisizEmbed] })
                }
                break;
            case 'durdur':
                if(sistemDB.fetch(`${message.guild.id}.kelimeoyun`) == null) {
                    basarisizEmbed.setDescription(`
Kelime oyunu kanalı ayarlanmamış!

> Ayarlamak için: \`${prefix}kelimeturetmece kanal [<kanal>]\`
                    `)
                    return message.reply({ embeds: [basarisizEmbed] });
                }
                if(sistemDB.fetch(`${message.guild.id}.kelimeoyun.durum`) == "Başlamamış") return message.reply("Kelime oyunu zaten durdurulmuş.");
                sistemDB.set(`${message.guild.id}.kelimeoyun.durum`, 'Başlamamış');
                basariliEmbed.setDescription(`
Başarıyla kelime oyunu durdu.
                `)
                message.reply({ embeds: [basariliEmbed] });

                break;
            case 'kapat':
                sistemDB.delete(`${message.guild.id}.kelimeoyun`);
                basariliEmbed.setDescription(`
Kelime oyunu başarıyla kapatıldı.
                `)
                message.reply({ embeds: [basariliEmbed] });
                break;
            default:
                message.reply({ embeds: [hata] });
                break;
        }

    }
}