const { Client, Message, MessageEmbed } = require("discord.js");
const { JsonDatabase } = require("wio.db");

module.exports = {
	name: 'bomoyun',
    aliases: ['boom'],
	description: `Boom Oyunu`,
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
            title: "Boom Oyunu (Başarılı)",
            color: "GREEN",
            footer: {
                text: client.config.footer
            }
        });

        const basarisizEmbed = new MessageEmbed({
            title: "Boom Oyunu (Başarısız)",
            color: "RED",
            footer: {
                text: client.config.footer
            }
        });
        let prefix = client.config.prefix;

        const hata = new MessageEmbed({
            title: "Boom (Yardım)",
            color: "LIGHT_GREY",
            footer: {
                text: client.config.footer
            },
            description: `
**${prefix}boom kanal [<kanal>]** => \`Boom Oyunu kanalını ayarlar.\`
**${prefix}boom başlat** => \`Boom Oyunu ayarlanmış kanalda başlatır.\`
**${prefix}boom durdur** => \`Boom Oyununu durdurur.\`
**${prefix}boom sıfırla** => \`Boom Oyununu sıfırlar.\`
            `
        });
        let sistemDB = new JsonDatabase({
            databasePath: "database/sistemDB"
        });

        switch (String(args[0]).toLowerCase()) {
            case 'kanal':
                let sayiChannel = message.mentions.channels.first();
                if(sayiChannel != null) {
                    sistemDB.set(`${message.guild.id}.boomoyun.kanal`, sayiChannel.id);
                    sistemDB.set(`${message.guild.id}.boomoyun.durum`, 'Başlamamış');
                    basariliEmbed.setDescription(`
Başarıyla Boom oyunu kanalı ayarlandı!

> Kanal: ${sayiChannel}
> Oyunu başlatmak için: \`${prefix}boom başlat\`
                    `)
                    message.reply({ embeds: [basariliEmbed] })
                } else {
                    message.reply({ content: ":x: Geçersiz kanal", embeds: [hata] })
                }
                break;
            case 'başlat':
                let channel = message.guild.channels.cache.get(sistemDB.fetch(`${message.guild.id}.boomoyun.kanal`));
                if(sistemDB.fetch(`${message.guild.id}.boomoyun.durum`) == "Başladı") return message.reply("Boom oyunu zaten devam ediyor.");
                if(channel != null) {
                    sistemDB.set(`${message.guild.id}.boomoyun.durum`, 'Başladı');
                    basariliEmbed.setDescription(`
Başarıyla Boom oyunu ${channel} kanalında başlatıldı.

> İlk sayı: \`1\`
                    `)
                    message.channel.send({ embeds: [basariliEmbed] });
                    sistemDB.set(`${message.guild.id}.boomoyun.siradakisayi`, 1);
                    basariliEmbed.setDescription(`
Boom Oyunu başladı.

> İlk sayı: \`1\`
                    `)

                    channel.send({ embeds: [basariliEmbed] })
                } else {
                    basarisizEmbed.setDescription(`
Boom oyunu kanalı ayarlanmamış!

> Ayarlamak için: \`${prefix}boom kanal [<kanal>]\`
                    `)
                    message.reply({ embeds: [basarisizEmbed] })
                }
                break;
            case 'durdur':
                if(sistemDB.fetch(`${message.guild.id}.boomoyun`) == null) {
                    basarisizEmbed.setDescription(`
Boom oyunu kanalı ayarlanmamış!

> Ayarlamak için: \`${prefix}boom kanal [<kanal>]\`
                    `)
                    return message.reply({ embeds: [basarisizEmbed] });
                }
                if(sistemDB.fetch(`${message.guild.id}.boomoyun.durum`) == "Başlamamış") return message.reply("Boom oyunu zaten durdurulmuş.");
                sistemDB.set(`${message.guild.id}.boomoyun.durum`, 'Başlamamış');
                basariliEmbed.setDescription(`
Başarıyla Boom oyunu durdu.
                `)
                message.reply({ embeds: [basariliEmbed] });

                break;
            case 'kapat':
                sistemDB.delete(`${message.guild.id}.boomoyun`);
                basariliEmbed.setDescription(`
Boom oyunu başarıyla kapatıldı.
                `)
                message.reply({ embeds: [basariliEmbed] });
                break;
            default:
                message.reply({ embeds: [hata] });
                break;
        }

    }
}