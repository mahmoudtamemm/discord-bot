require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// تخزين AFK
const afkUsers = new Map();

// تشغيل البوت
client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// أمر ping
client.on('messageCreate', message => {

  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('Pong! 🏓');
  }

  // تشغيل AFK
  if (message.content.startsWith('!afk')) {

    const reason = message.content.split(' ').slice(1).join(' ') || 'بدون سبب';

    afkUsers.set(message.author.id, reason);

    message.reply(`💤 تم تفعيل AFK: ${reason}`);
    return;
  }

  // إلغاء AFK لو رجع يكتب
  if (afkUsers.has(message.author.id)) {
    afkUsers.delete(message.author.id);
    message.reply('👋 تم إلغاء AFK، أهلاً بعودتك!');
  }

  // تنبيه لو أحد منشن شخص AFK
  const mentioned = message.mentions.users.first();
  if (mentioned && afkUsers.has(mentioned.id)) {
    const reason = afkUsers.get(mentioned.id);
    message.reply(`💤 هذا الشخص AFK: ${reason}`);
  }

});

// ترحيب الأعضاء
client.on('guildMemberAdd', member => {

  const channel = member.guild.channels.cache.get('1507040612090908885');

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor('Blue')
    .setTitle('👋 عضو جديد!')
    .setDescription(`أهلاً بك ${member} في السيرفر 💙`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

client.login(process.env.TOKEN);