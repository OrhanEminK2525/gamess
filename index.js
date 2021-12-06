const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client({
  disableMentions: "everyone",
  intents: [32767],
  shards: "auto"
})
const {JsonDatabase} = require("wio.db");

client.config = {
    "sahip": ["787043042569355265"],
    "token": "NzkwOTQ1NDg4MDE4OTk3Mjk5.X-H_Yw.PZ6HBXeP3HPaOzQUtjQagNm-PBo",
    "prefix": "!",
    "footer": "midev ©️ Tüm hakları saklıdır.",
}
client.harfler = [
    "a", "b", "c", "ç", "d", "e", "f", "g", "h", "i",
    "y", "k", "l" , "m", "n", "p", "q", "r", "s", "ş",
    "t", "u", "v", "w", "y", "z"
]
fs.readdir("./commands", function(err, files) {
    client.commands = new Discord.Collection();
    files.forEach(cmd => {
        const properties = require("./commands/"+cmd);
      
        client.commands.set(properties.name, properties);
        if(properties.aliases.length > 0) {
            properties.aliases.forEach(alias => {
                client.commands.set(alias, properties);
            })
        }
        console.log("Komut yüklendi: " + properties.name)
    })
})

fs.readdir("./events", function(err, files) {
    files.forEach(event => {
        const properties = require("./events/"+event);
      
        client.on(properties.event, properties.run.bind(null, client));
        console.log("Event yüklendi: " + properties.event)
    })
})


client.on("ready", async() => {    
    console.log("Bot aktif.")
})

client.login(client.config.token);

// Events
client.on("messageCreate", async(message) => {
  
    const args = message.content.split(" ").slice(client.config.prefix.length);
    const cmd = message.content.split(" ")[0].slice(client.config.prefix.length);
    
    const command = client.commands.get(cmd);
    if(command != null) {
      
        command.run(client, message, args);
      
    }
})


// Functions
client.getChannel = (string) => {
    var id = null;
    if(string.startsWith("<#") && string.endsWith(">")) {
        id = string
            .replace("<", "")
            .replace("#", "")
            .replace("!", "")
            .replace(">", "");
    } else if(client.channels.cache.get(string) != null) {
        id = string;
    } else {
        id = null;
    }
    
    if(id != null) {
        return client.channels.cache.get(id);
    } else {
        return null;
    }
}