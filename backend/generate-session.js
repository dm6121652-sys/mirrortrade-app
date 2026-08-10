"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const teleproto_1 = require("teleproto");
const sessions_1 = require("teleproto/sessions");
const readline = require("readline");
const API_ID = 38771280;
const API_HASH = 'abe487583d3bd2f1ba502b64719a46fb';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
async function main() {
    console.log('\n🚀 Trallo Telegram Session Generator\n');
    console.log('This will log into your Telegram account and generate a SESSION_STRING.');
    console.log('You only need to run this ONCE.\n');
    const session = new sessions_1.StringSession('');
    const client = new teleproto_1.TelegramClient(session, API_ID, API_HASH, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => {
            const phone = await ask('📱 Enter your phone number (with country code, e.g. +2348012345678): ');
            return phone.trim();
        },
        password: async () => {
            const pwd = await ask('🔐 Enter your 2FA password (press Enter if none): ');
            return pwd.trim();
        },
        phoneCode: async () => {
            const code = await ask('📨 Enter the OTP code Telegram sent you: ');
            return code.trim();
        },
        onError: (err) => {
            console.error('❌ Error:', err.message);
        },
    });
    const sessionString = client.session.save();
    console.log('\n\n✅ SUCCESS! Here is your SESSION_STRING:\n');
    console.log('='.repeat(80));
    console.log(sessionString);
    console.log('='.repeat(80));
    console.log('\n📋 Next steps:');
    console.log('  1. Copy the SESSION_STRING above (everything between the === lines)');
    console.log('  2. Go to Railway → your backend service → Variables');
    console.log('  3. Add these 3 variables:');
    console.log(`     TELEGRAM_API_ID     = 38771280`);
    console.log(`     TELEGRAM_API_HASH   = abe487583d3bd2f1ba502b64719a46fb`);
    console.log(`     TELEGRAM_SESSION    = <paste SESSION_STRING here>`);
    console.log('\n⚠️  Keep your SESSION_STRING secret — it gives full access to your Telegram account!\n');
    await client.disconnect();
    rl.close();
}
main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=generate-session.js.map