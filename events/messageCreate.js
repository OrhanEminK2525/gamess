const { MessageEmbed } = require("discord.js");
const { JsonDatabase } = require("wio.db")
const fetch = require("node-fetch");
module.exports = {
    event: "messageCreate",
    run: async(client, message) => {
        
        
        let sistemDB = new JsonDatabase({
            databasePath: "database/sistemDB"
        });


        if(sistemDB.fetch(`${message.guild.id}.kelimeoyun.kanal`) != null) {
            const basariliEmbed = new MessageEmbed({
                title: "Kelime Oyunu",
                color: "GREEN",
                footer: {
                    text: client.config.footer
                }
            });
    
            const basarisizEmbed = new MessageEmbed({
                title: "Kelime Oyunu",
                color: "RED",
                footer: {
                    text: client.config.footer
                }
            });
            if(message.author.bot) return;
            let kelimeOyunDB = new JsonDatabase({
                databasePath: "database/kelimeOyunDB"
            });
            let channel = sistemDB.fetch(`${message.guild.id}.kelimeoyun.kanal`);
            let durum = sistemDB.fetch(`${message.guild.id}.kelimeoyun.durum`);
            if(message.channel.id == channel) {
                if(durum == "Başladı") {
                    if(message.content.charAt(0) == "@" || message.content.charAt(0) == ".") return;
                    message.content = message.content.replaceChars().turkishtoEnglish();
                    let kelime = message.content.toLowerCase();
                    let sonKarakter = kelime.charAt(message.content.length - 1);
                    let ilkKarakter = kelime.charAt(0);
                    let sonYazanID = sistemDB.fetch(`${message.guild.id}.kelimeoyun.sonyazan`);
                    let sonHarf = sistemDB.fetch(`${message.guild.id}.kelimeoyun.sonharf`);
                    if(kelime.split("").length <= 2) return message.delete();
                    if(message.member.id == sonYazanID) {
                        basarisizEmbed.setDescription(`
Lütfen arka arkaya kelime türetmeyin.
                        `)
                        message.delete();
                        return message.channel.send({ content: `${message.member}`, embeds: [basarisizEmbed] }).then(msg => { setTimeout(() => { msg.delete().catch(err => { }) }, 3000) })
                    }
                    else if(ilkKarakter == sonHarf && (sonHarf != "x" || sonHarf != "ğ")) {
                        if(kelimeOyunDB.fetch(`${message.guild.id}.kelimeler.${kelime}`) < 1 || kelimeOyunDB.fetch(`${message.guild.id}.kelimeler.${kelime}`) == null) {
                            let web = await fetch("https://sozluk.gov.tr/gts?ara=" + kelime).then(res => res.json());
                            if(web['error'] != null) {
                                message.delete();
                            } else {
                                message.react("☑")
                                sistemDB.set(`${message.guild.id}.kelimeoyun.sonharf`, sonKarakter);
                                sistemDB.set(`${message.guild.id}.kelimeoyun.sonyazan`, message.author.id);
                                let kelimeler = kelimeOyunDB.fetch(`${message.guild.id}.kelimeler`) ? Object.keys(kelimeOyunDB.fetch(`${message.guild.id}.kelimeler`)) : [];
                                kelimeler.forEach((klme) => {
                                    kelimeOyunDB.substr(`${message.guild.id}.kelimeler.${klme}`, 1);
                                })
                                kelimeOyunDB.set(`${message.guild.id}.kelimeler.${kelime}`, 15);
                            }
                        } else {
                            basarisizEmbed.setDescription(`
Bu kelimeyi \`${kelimeOyunDB.fetch(`${message.guild.id}.kelimeler.${kelime}`)}\` kelime sonra tekrar kullanabilir hale gelecek.
                            `)
                            message.delete();
                            return message.channel.send({ content: `${message.member}`, embeds: [basarisizEmbed] }).then(msg => { setTimeout(() => { msg.delete().catch(err => { }) }, 3000) });
                        }
                    }
                    else if(sonKarakter == "x" || sonKarakter == "ğ") {
                        if(kelimeOyunDB.fetch(`${message.guild.id}.kelimeler.${kelime}`) < 1 || kelimeOyunDB.fetch(`${message.guild.id}.kelimeler.${kelime}`) == null) {
                            let web = await fetch("https://sozluk.gov.tr/gts?ara=" + kelime).then(res => res.json());
                            if(web['error']) return message.delete();
                            let yeniHarf = client.harfler[Math.floor(Math.random() * client.harfler.length)];
                            let puan = Math.floor(Math.random() * 1000);
                            kelimeOyunDB.set(`${message.guild.id}.puan.${message.member.id}`, puan);
                            kelimeOyunDB.add(`${message.guild.id}.kelimeler.${kelime}`, 15);
                            let kelimeler = kelimeOyunDB.fetch(`${message.guild.id}.kelimeler`) ? Object.keys(kelimeOyunDB.fetch(`${message.guild.id}.kelimeler`)) : [];
                            kelimeler.forEach((klme) => {
                                kelimeOyunDB.substr(`${message.guild.id}.kelimeler.${klme}`, 1);
                            })
                            basariliEmbed.setDescription(`
Kelime Oyunun bu turunu ${message.member} kazandı.

> Kazanılan puan: \`${puan}\`
> Yeni harf: \`${yeniHarf}\`
                            `)
                            sistemDB.set(`${message.guild.id}.kelimeoyun.sonharf`, yeniHarf);
                            return message.reply({ embeds: [basariliEmbed] });
                        } else {
                            basarisizEmbed.setDescription(`
Bu kelimeyi \`${kelimeOyunDB.fetch(`${message.guild.id}.kelimeler.${kelime}`)}\` kelime sonra tekrar kullanabilir hale gelecek.
                            `)
                            message.delete();
                            return message.channel.send({ content: `${message.member}`, embeds: [basarisizEmbed] }).then(msg => { setTimeout(() => { msg.delete().catch(err => { }) }, 3000) });
                        }
                    } else {
                        message.delete();
                    }
                }
            }
        }

        if(sistemDB.fetch(`${message.guild.id}.sayisayma.kanal`) != null) {
            const basariliEmbed = new MessageEmbed({
                title: "Sayı Sayma",
                color: "GREEN",
                footer: {
                    text: client.config.footer
                }
            });
    
            const basarisizEmbed = new MessageEmbed({
                title: "Sayı Sayma",
                color: "RED",
                footer: {
                    text: client.config.footer
                }
            });
            if(message.author.bot) return;
            let channel = sistemDB.fetch(`${message.guild.id}.sayisayma.kanal`);
            let durum = sistemDB.fetch(`${message.guild.id}.sayisayma.durum`);
            if(message.channel.id == channel) {
                if(durum == "Başladı") {
                    let sonYazanID = sistemDB.fetch(`${message.guild.id}.sayisayma.sonyazan`);
                    let siradakisayi = sistemDB.fetch(`${message.guild.id}.sayisayma.siradakisayi`);
                    if(message.author.id == sonYazanID) {
                        basarisizEmbed.setDescription(`
Lütfen arka arkaya sayı saymayınız.
                        `)
                        message.delete();
                        return message.channel.send({ content: `${message.member}`, embeds: [basarisizEmbed] }).then(msg => { setTimeout(() => { msg.delete().catch(err => { }) }, 3000) })
                    } else if(message.content == siradakisayi) {
                        message.react("☑");
                        sistemDB.add(`${message.guild.id}.sayisayma.siradakisayi`, 1);
                        sistemDB.set(`${message.guild.id}.sayisayma.sonyazan`, message.author.id);
                    } else {
                        message.delete();
                    }
                }
            }
        }

        if(sistemDB.fetch(`${message.guild.id}.boomoyun.kanal`) != null) {
            const basariliEmbed = new MessageEmbed({
                title: "Sayı Sayma",
                color: "GREEN",
                footer: {
                    text: client.config.footer
                }
            });
    
            const basarisizEmbed = new MessageEmbed({
                title: "Sayı Sayma",
                color: "RED",
                footer: {
                    text: client.config.footer
                }
            });
            if(message.author.bot) return;
            let channel = sistemDB.fetch(`${message.guild.id}.boomoyun.kanal`);
            let durum = sistemDB.fetch(`${message.guild.id}.boomoyun.durum`);
            if(message.channel.id == channel) {
                if(durum == "Başladı") {
                    let sonYazanID = sistemDB.fetch(`${message.guild.id}.boomoyun.sonyazan`);
                    let siradakisayi = sistemDB.fetch(`${message.guild.id}.boomoyun.siradakisayi`);
                    if(message.author.id == sonYazanID) {
                        basarisizEmbed.setDescription(`
Lütfen arka arkaya sayı saymayın.
                        `)
                        message.delete();
                        return message.channel.send({ content: `${message.member}`, embeds: [basarisizEmbed] }).then(msg => { setTimeout(() => { msg.delete().catch(err => { }) }, 3000) })
                    } else if(message.content) {
                        let sonSayi = message.content.charAt(message.content.length - 1);
                        let siradakiSayiSon = String(siradakisayi).charAt(String(siradakisayi).length - 1)
                        
                        if(message.content == String(siradakisayi).toLowerCase() && (siradakiSayiSon != 5 || siradakiSayiSon != 0)) {
                            if(sonSayi != 5) {
                                sistemDB.add(`${message.guild.id}.boomoyun.siradakisayi`, 1);
                                message.react("☑")
                                sistemDB.set(`${message.guild.id}.boomoyun.sonyazan`, message.author.id)
                            } else if(sonSayi == 5) {
                                message.delete();
                            }
                        } else if(siradakiSayiSon == 5 || siradakiSayiSon == 0) {
                            let gecerliBoomlar = ["💣", "bom", "boom"];

                            if(gecerliBoomlar.includes(message.content.toLowerCase())) {
                                sistemDB.add(`${message.guild.id}.boomoyun.siradakisayi`, 1);
                                message.react("💣");
                                sistemDB.set(`${message.guild.id}.boomoyun.sonyazan`, message.author.id)
                            } else {
                                message.delete();
                            }
                        } else {
                            message.delete();
                        }
                    }
                }
            }
        }

    }
}

String.prototype.replaceChars = function () {
    return this.replaceAll("+", "")
    .replaceAll("/", "")
    .replaceAll("\\", "")
    .replaceAll("*", "")
    .replaceAll(",", "")
    .replaceAll(".", "")
    .replaceAll("_", "")
    .replaceAll(";", "")
    .replaceAll("#", "")
    .replaceAll(">", "")
    .replaceAll("<", "")
    .replaceAll(":", "")
    .replaceAll("£", "")
    .replaceAll("½", "")
    .replaceAll("$", "")
    .replaceAll("½", "")
    .replaceAll("&", "")
    .replaceAll("{", "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("}", "")
    .replaceAll("|", "")
    .replaceAll("`", "")
    .replaceAll("!", "")
    .replaceAll("'", "")
    .replaceAll("^", "")
    .replaceAll("%", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("=", "")
    .replaceAll("?", "")
    .replaceAll("~", "")
    .replaceAll("-", "");
}
String.prototype.turkishtoEnglish = function () {
    return this.replace('Ğ','ğ')
        .replace('Ü','ü')
        .replace('Ş','ş')
        .replace('I','ı')
        .replace('İ','i')
        .replace('Ö','ö')
        .replace('Ç','ç');
};