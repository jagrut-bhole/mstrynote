// Quick test script to verify email configuration
// Run with: node --loader tsx test-email.ts
// Or add to package.json scripts: "test:email": "tsx test-email.ts"

import { transporter } from './src/lib/mailer';

async function testEmailConnection() {
    console.log('Testing SMTP connection...\n');
    
    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP server connection successful!\n');
        
        // Send test email
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'MstryNote - Email Configuration Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Configuration Test</h2>
                    <p>If you're reading this, your email configuration is working correctly! 🎉</p>
                    <hr>
                    <p><strong>Configuration Details:</strong></p>
                    <ul>
                        <li>SMTP Host: ${process.env.SMTP_HOST}</li>
                        <li>SMTP Port: ${process.env.SMTP_PORT}</li>
                        <li>From: ${process.env.SMTP_FROM_EMAIL}</li>
                    </ul>
                    <p>You can now use this configuration for your MstryNote application.</p>
                </div>
            `,
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log(`\nCheck your inbox at: ${process.env.SMTP_USER}`);
        
    } catch (error) {
        console.error('❌ Email test failed:\n');
        console.error(error);
        console.log('\nTroubleshooting tips:');
        console.log('1. Check your .env file has correct SMTP credentials');
        console.log('2. For Gmail, make sure you use an App Password');
        console.log('3. Check your firewall/antivirus settings');
        console.log('4. See EMAIL_SETUP.md for more help');
        process.exit(1);
    }
}

testEmailConnection();
