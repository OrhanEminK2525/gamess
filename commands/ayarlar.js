const { Client, Message, MessageEmbed } = require("discord.js");
const { JsonDatabase } = require("wio.db");

module.exports = {
	name: 'ayarlar',
    aliases: ['settings'],
	description: `Ayarlar`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String} args 
     */
    run: async(client, message, args) => {

        let sistemDB = new JsonDatabase({
            databasePath: "database/sistemDB"
        })

        let kelimeOyunSettings = sistemDB.fetch(`${message.guild.id}.kelimeoyun`) || {
            kanal: null,
            sonharf: null,
            durum: null
        };
        let sayiSaymaOyunSettings = sistemDB.fetch(`${message.guild.id}.sayisayma`) || {
            kanal: null,
            siradakisayi: null,
            durum: null
        };
        let boomOyunSettings = sistemDB.fetch(`${message.guild.id}.boomoyun`) || {
            kanal: null,
            siradakisayi: null,
            durum: null
        };

        const embed = new MessageEmbed({
            title: "Sunucu ayarları",
            author: {
                name: `${message.guild.name}`
            },
            color: "NAVY",
            footer: {
                text: client.config.footer
            },
            fields: [
                // Kelime Oyun
                {
                    name: " - & - ",
                    value: "Kelime Oyun ayarları:",
                    inline: false,
                },
                {
                    name: "Kanal:",
                    value: `${message.guild.channels.cache.get(kelimeOyunSettings["kanal"]) ? message.guild.channels.cache.get(kelimeOyunSettings["kanal"]) : `Kapalı`}`,
                    inline: true,
                },
                {
                    name: "Durum:",
                    value: `${kelimeOyunSettings["durum"] ? kelimeOyunSettings["durum"] : `Başlamamış`}`,
                    inline: true,
                },
                {
                    name: "Son Harf:",
                    value: `${kelimeOyunSettings["sonharf"] ? "`" + kelimeOyunSettings["sonharf"] + "`" : "`Yok`"}`,
                    inline: true,
                },
                // Sayı Sayma
                {
                    name: " - & - ",
                    value: `Sayı Sayma oyun ayarları:`,
                    inline: false,
                },
                {
                    name: "Kanal:",
                    value: `${message.guild.channels.cache.get(sayiSaymaOyunSettings["kanal"]) ? message.guild.channels.cache.get(sayiSaymaOyunSettings["kanal"]) : `Kapalı`}`,
                    inline: true,
                },
                {
                    name: "Durum:",
                    value: `${sayiSaymaOyunSettings["durum"] ? sayiSaymaOyunSettings["durum"] : `Başlamamış`}`,
                    inline: true,
                },
                {
                    name: "Sıradaki sayı:",
                    value: `${sayiSaymaOyunSettings["siradakisayi"] ? "`" + sayiSaymaOyunSettings["siradakisayi"] + "`" : "`Yok`"}`,
                    inline: true,
                },
                // Boom
                {
                    name: " - & - ",
                    value: `Boom oyun ayarları:`,
                    inline: false,
                },
                {
                    name: "Kanal:",
                    value: `${message.guild.channels.cache.get(boomOyunSettings["kanal"]) ? message.guild.channels.cache.get(boomOyunSettings["kanal"]) : `Kapalı`}`,
                    inline: true,
                },
                {
                    name: "Durum:",
                    value: `${boomOyunSettings["durum"] ? boomOyunSettings["durum"] : `Başlamamış`}`,
                    inline: true,
                },
                {
                    name: "Sıradaki sayı:",
                    value: `${boomOyunSettings["siradakisayi"] ? "`" + boomOyunSettings["siradakisayi"] + "`" : "`Yok`"}`,
                    inline: true,
                }
            ]
        })
        message.reply({ embeds: [embed] })

    }
}