# 🚀 Quick Reference: Email Configuration

## Required .env Variables

```env
# SMTP Server Settings
SMTP_HOST=smtp.gmail.com              # Your email provider's SMTP server
SMTP_PORT=587                          # Usually 587 (TLS) or 465 (SSL)
SMTP_SECURE=false                      # true for 465, false for 587
SMTP_USER=your-email@gmail.com        # Your email address
SMTP_PASS=your-app-password            # Your password or app password
SMTP_FROM_NAME=MstryNote              # Sender name shown in emails
SMTP_FROM_EMAIL=your-email@gmail.com  # Must match SMTP_USER for most providers
```

---

## Gmail Setup (2 minutes)

1. **Enable 2FA**: https://myaccount.google.com/security
2. **Get App Password**: https://myaccount.google.com/apppasswords
3. **Copy 16-character password** (remove spaces)
4. **Update .env**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourname@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=yourname@gmail.com
```
5. **Restart server**: `npm run dev`

---

## SendGrid Setup (Production)

1. **Sign up**: https://sendgrid.com (100 free emails/day)
2. **Create API Key**: Settings → API Keys
3. **Update .env**:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key-here
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

---

## Mailtrap Setup (Testing)

1. **Sign up**: https://mailtrap.io
2. **Copy credentials** from inbox settings
3. **Update .env**:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=test@example.com
```

---

## Console Messages

### ✅ Success
```
SMTP server is ready to send emails
Email sent successfully. Message ID: <message-id>
```

### ❌ Common Errors

**"Invalid login"**
→ Check username/password. For Gmail, use App Password.

**"Connection timeout"**
→ Check firewall, try different port, or different network.

**"self signed certificate"**
→ Add to `src/lib/mailer.ts`:
```typescript
tls: { rejectUnauthorized: false }
```

---

## Testing

1. **Start dev server**: `npm run dev`
2. **Register new user** with your email
3. **Check inbox** (and spam folder)
4. **Console logs** show success/failure

---

## Production Deployment

Add these to your hosting platform (Vercel, Railway, etc.):

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-production-api-key
SMTP_FROM_NAME=MstryNote
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

---

## Files You Changed

- ✅ `src/lib/mailer.ts` - Email configuration
- ✅ `src/services/sendVerificationEmail.ts` - Sending logic
- ✅ `.env` - Your credentials

---

## Need More Help?

- 📖 **Detailed guide**: `EMAIL_SETUP.md`
- 📋 **Full summary**: `MIGRATION_SUMMARY.md`
- 🐛 **Having issues?** Check console logs first!

---

**That's it! You're ready to send emails! 🎉**
