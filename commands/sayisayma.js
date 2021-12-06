const { Client, Message, MessageEmbed } = require("discord.js");
const { JsonDatabase } = require("wio.db");

module.exports = {
	name: 'sayısayma',
    aliases: ['sayisayma'],
	description: `Sayı Sayma Oyunu`,
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
            title: "Sayı Sayma Oyunu (Başarılı)",
            color: "GREEN",
            footer: {
                text: client.config.footer
            }
        });

        const basarisizEmbed = new MessageEmbed({
            title: "Sayı Sayma Oyunu (Başarısız)",
            color: "RED",
            footer: {
                text: client.config.footer
            }
        });
        let prefix = client.config.prefix;

        const hata = new MessageEmbed({
            title: "Sayı Sayma (Yardım)",
            color: "LIGHT_GREY",
            footer: {
                text: client.config.footer
            },
            description: `
**${prefix}sayısayma kanal [<kanal>]** => \`Sayı Sayma Oyunu kanalını ayarlar.\`
**${prefix}sayısayma başlat** => \`Sayı Sayma Oyunu ayarlanmış kanalda başlatır.\`
**${prefix}sayısayma durdur** => \`Sayı Sayma Oyununu durdurur.\`
**${prefix}sayısayma sıfırla** => \`Sayı Sayma Oyununu sıfırlar.\`
            `
        });
        let sistemDB = new JsonDatabase({
            databasePath: "database/sistemDB"
        });

        switch (String(args[0]).toLowerCase()) {
            case 'kanal':
                let sayiChannel = message.mentions.channels.first();
                if(sayiChannel != null) {
                    sistemDB.set(`${message.guild.id}.sayisayma.kanal`, sayiChannel.id);
                    sistemDB.set(`${message.guild.id}.sayisayma.durum`, 'Başlamamış');
                    basariliEmbed.setDescription(`
Başarıyla sayı sayma oyunu kanalı ayarlandı!

> Kanal: ${sayiChannel}
> Oyunu başlatmak için: \`${prefix}sayısayma başlat\`
                    `)
                    message.reply({ embeds: [basariliEmbed] })
                } else {
                    message.reply({ content: ":x: Geçersiz kanal", embeds: [hata] })
                }
                break;
            case 'başlat':
                let channel = message.guild.channels.cache.get(sistemDB.fetch(`${message.guild.id}.sayisayma.kanal`));
                if(sistemDB.fetch(`${message.guild.id}.sayisayma.durum`) == "Başladı") return message.reply("Sayı Sayma oyunu zaten devam ediyor.");
                if(channel != null) {
                    sistemDB.set(`${message.guild.id}.sayisayma.durum`, 'Başladı');
                    basariliEmbed.setDescription(`
Başarıyla sayı sayma oyunu ${channel} kanalında başlatıldı.

> İlk harf: \`1\`
                    `)
                    message.channel.send({ embeds: [basariliEmbed] });
                    sistemDB.set(`${message.guild.id}.sayisayma.siradakisayi`, 1);
                    basariliEmbed.setDescription(`
Sayı Sayma Oyunu başladı.

> İlk sayı: \`1\`
                    `)

                    channel.send({ embeds: [basariliEmbed] })
                } else {
                    basarisizEmbed.setDescription(`
Sayı Sayma oyunu kanalı ayarlanmamış!

> Ayarlamak için: \`${prefix}sayısayma kanal [<kanal>]\`
                    `)
                    message.reply({ embeds: [basarisizEmbed] })
                }
                break;
            case 'durdur':
                if(sistemDB.fetch(`${message.guild.id}.sayisayma`) == null) {
                    basarisizEmbed.setDescription(`
Sayı Sayma oyunu kanalı ayarlanmamış!

> Ayarlamak için: \`${prefix}sayısayma kanal [<kanal>]\`
                    `)
                    return message.reply({ embeds: [basarisizEmbed] });
                }
                if(sistemDB.fetch(`${message.guild.id}.sayisayma.durum`) == "Başlamamış") return message.reply("Sayı Sayma oyunu zaten durdurulmuş.");
                sistemDB.set(`${message.guild.id}.sayisayma.durum`, 'Başlamamış');
                basariliEmbed.setDescription(`
Başarıyla sayı sayma oyunu durdu.
                `)
                message.reply({ embeds: [basariliEmbed] });

                break;
            case 'kapat':
                sistemDB.delete(`${message.guild.id}.sayisayma`);
                basariliEmbed.setDescription(`
Sayı Sayma oyunu başarıyla kapatıldı.
                `)
                message.reply({ embeds: [basariliEmbed] });
                break;
            default:
                message.reply({ embeds: [hata] });
                break;
        }

    }
}