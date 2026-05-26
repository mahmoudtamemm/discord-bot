const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

// ===== CONFIG =====
const TOKEN = 'MTUwNzExMDE4MTAxMDU0MjczMw.GLuZ8B.d2CGn2_knd6KQCvUgz0sj2DuDxHhM3HMpYsX7A';

const ADMIN_ROLE_ID = '1507041644552392725';
const WELCOME_CHANNEL_ID = '1507040612090908885';

// ===== CLIENT =====
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ===== READY EVENT =====
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// ===== WELCOME MESSAGE =====
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    const welcomeMessage = `
💎 𝓣𝓗𝓔 𝓛𝓔𝓖𝓔𝓝𝓓 💎
نورتنا يا غالي 💙
<@${member.id}>
ان شاء الله تكون مبسوط معنا! 💎
`;

    channel.send({ content: welcomeMessage });
});

// ===== ADMIN COMMANDS =====
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const member = message.member;
    if (!member) return;

    // check admin role
    if (!member.roles.cache.has(ADMIN_ROLE_ID)) return;

    const args = message.content.trim().split(/\s+/);
    const command = args[0].toLowerCase();
    const target = message.mentions.members.first();

    // ===== BAN =====
    if (command === '#ban') {
        if (!target) return message.reply('🚫 منشن العضو الذي تريد حظره!');

        await target.ban({ reason: `By ${message.author.tag}` });
        message.channel.send(`✅ تم حظر ${target.user.tag}`);
    }

    // ===== KICK =====
    if (command === '#kick') {
        if (!target) return message.reply('🚫 منشن العضو الذي تريد طرده!');

        await target.kick(`By ${message.author.tag}`);
        message.channel.send(`✅ تم طرد ${target.user.tag}`);
    }

    // ===== CLEAR =====
    if (command === '#clear') {
        try {
            const fetched = await message.channel.messages.fetch({ limit: 100 });
            await message.channel.bulkDelete(fetched, true);

            const msg = await message.channel.send('✅ تم مسح الرسائل!');
            setTimeout(() => msg.delete().catch(() => {}), 3000);

        } catch (err) {
            console.error(err);
            message.channel.send('🚫 حدث خطأ أثناء المسح!');
        }
    }
});

// ===== LOGIN =====
client.login(TOKEN);
