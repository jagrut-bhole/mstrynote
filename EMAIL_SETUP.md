# Email Configuration Guide

This project uses **Nodemailer** for sending verification emails via SMTP.

## Setup Instructions

### 1. Choose Your Email Provider

You can use any SMTP email service. Here are common options:

#### Option A: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=your-email@gmail.com
```

#### Option B: Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=your-email@outlook.com
```

#### Option C: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com (Free tier: 100 emails/day)
2. Create an API Key
3. Configure:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=verified-sender@yourdomain.com
```

#### Option D: Mailtrap (For Testing Only)

Perfect for testing without sending real emails:

1. Sign up at https://mailtrap.io
2. Get your credentials from the inbox settings

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=test@example.com
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # Your SMTP server
SMTP_PORT=587                      # Usually 587 for TLS, 465 for SSL
SMTP_SECURE=false                  # true for port 465, false for other ports
SMTP_USER=your-email@gmail.com    # Your email/username
SMTP_PASS=your-password            # Your password or app password
SMTP_FROM_NAME=MstryNote          # Sender name
SMTP_FROM_EMAIL=your-email@gmail.com  # Sender email (must match SMTP_USER for most providers)
```

### 3. Test Your Configuration

After updating `.env`, restart your development server:

```bash
npm run dev
```

Try registering a new user - you should see "SMTP server is ready to send emails" in the console.

## Troubleshooting

### "Invalid login" or "Authentication failed"

- **Gmail**: Make sure you're using an App Password, not your regular password
- **Outlook**: Check if you need to enable "Allow less secure apps"
- Check your username and password are correct

### "Connection timeout"

- Check your firewall/antivirus isn't blocking SMTP
- Try a different port (587 vs 465)
- Some networks block SMTP - try a different network/VPN

### Emails not arriving

- Check spam/junk folder
- Verify SMTP_FROM_EMAIL matches your authenticated email
- For Gmail: Make sure App Password is correctly copied (no spaces)
- Use Mailtrap to test without real email delivery

### "self signed certificate" error

Add this to your transporter config in `src/lib/mailer.ts`:

```typescript
tls: {
    rejectUnauthorized: false
}
```

⚠️ Only use this for development, not production!

## Production Recommendations

For production deployments:

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Verify your domain** to improve deliverability
3. **Set up SPF, DKIM, and DMARC** records
4. **Monitor email metrics** (delivery rate, bounces, spam reports)
5. **Use environment-specific configurations**:
   - Development: Mailtrap
   - Staging: Test email service
   - Production: Production email service

## Files Modified

- `src/lib/mailer.ts` - Nodemailer transporter configuration
- `src/services/sendVerificationEmail.ts` - Email sending logic
- `.env` - SMTP credentials

## Migration from Resend

All Resend references have been replaced with Nodemailer. The email templates still use React Email components, which are rendered to HTML using `@react-email/render`.

Benefits:
- ✅ No domain verification required
- ✅ Works with any SMTP provider
- ✅ Free for most use cases
- ✅ Better control and flexibility
- ✅ Works in production immediately
