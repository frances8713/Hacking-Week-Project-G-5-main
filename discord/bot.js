// To start the app type in the terminal npm run devStart (devStart is the key to start the "nodemon bot.js", look it up in the package.json file)
const fetch = require("node-fetch");
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
  allowedMentions: {
    parse: [`users`, `roles`],
    repliedUser: true,
  },
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_REACTIONS",
  ],
});
//Log per vedere se l'app parte
client.on("ready", () => {
  console.log("I'm online");
});

const apiData = "https://api.spaceflightnewsapi.net/v3/";

async function getApi() {
  const fetchData = await fetch(`${apiData}articles?_limit=10`);
  const data = await fetchData.json();
  return data;
}

client.on("message", (msg) => {
  if (msg.content === "/articles") {
    let ids = [];
    getApi().then((data) => {
      data.forEach((element) => {
        ids.push(element.id);
      });
      msg.reply(`The id's of the available articles are : ${ids.join(", ")}`);
    });
  }
  if (msg.content === "/articles/authors") {
    let authors = [];
    getApi().then((data) => {
      data.forEach((elem) => {
        if (!authors.find((e) => e === elem.newsSite)) {
          authors.push(elem.newsSite);
        }
      });
      msg.reply(`The authors of the available articles are : ${authors.join(", ")}`);
    });
  }
  getApi().then((data) => {
    console.log(data);
    data.forEach((element) => {
      if (msg.content === `/articles/${element.id}`) {
        msg.reply(`The text content of the selected ID is: "${element.summary}"`);
      }
    });
  });
});

const welcomeCh = "1002605328669610146";
const communicationCh = "1004418160159633548";

client.on("guildMemberAdd", (member)=>{
  const welcomeMessage = `Hello <@${member.id}> welcome to the discord server, my name is DevelBot, allow me to guide you during your journey!`;
  const directionMessage = `Please follow me to the ${member.guild.channels.cache.get(
    communicationCh
  )} channel!`;
  const channel = member.guild.channels.cache.get(welcomeCh);
  const channel2 = member.guild.channels.cache.get(communicationCh);
  channel.send(welcomeMessage);
  setTimeout(() => channel.send(directionMessage), 3000);

  const commMessage = `Hello again <@${member.id}>`;
  const articlesMessage =
    "Type /articles to get the full ID list of the articles";
  const authorsMessage =
    "Type /articles/authors to get the full authors list of the articles";
  const textArticles =
    "Type /articles/ɪᴅ to get the text-content of the article you selected by specifing the ID";
  
  setTimeout(() => channel2.send(commMessage), 5000);
  setTimeout(() => channel2.send(articlesMessage), 6000);
  setTimeout(() => channel2.send(authorsMessage), 6000);
  setTimeout(() => channel2.send(textArticles), 6000);X

})

client.login(process.env.BOT_TOKEN);
