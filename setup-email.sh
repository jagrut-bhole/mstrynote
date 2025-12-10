#!/bin/bash

# Email Configuration Setup Script
# This script helps you configure SMTP settings for MstryNote

echo "================================"
echo "MstryNote Email Configuration"
echo "================================"
echo ""

# Function to update .env file
update_env() {
    local key=$1
    local value=$2
    local env_file=".env"
    
    if grep -q "^${key}=" "$env_file" 2>/dev/null; then
        # Update existing key
        sed -i "s|^${key}=.*|${key}=${value}|" "$env_file"
    else
        # Add new key
        echo "${key}=${value}" >> "$env_file"
    fi
}

# Select provider
echo "Select your email provider:"
echo "1) Gmail"
echo "2) Outlook/Hotmail"
echo "3) SendGrid"
echo "4) Mailtrap (Testing)"
echo "5) Custom SMTP"
echo ""
read -p "Enter choice [1-5]: " provider_choice

case $provider_choice in
    1)
        echo ""
        echo "Gmail Setup:"
        echo "1. Enable 2-Factor Authentication"
        echo "2. Generate App Password: https://myaccount.google.com/apppasswords"
        echo ""
        read -p "Enter your Gmail address: " gmail_user
        read -sp "Enter your App Password (16 characters): " gmail_pass
        echo ""
        
        update_env "SMTP_HOST" "smtp.gmail.com"
        update_env "SMTP_PORT" "587"
        update_env "SMTP_SECURE" "false"
        update_env "SMTP_USER" "$gmail_user"
        update_env "SMTP_PASS" "$gmail_pass"
        update_env "SMTP_FROM_NAME" "MstryNote"
        update_env "SMTP_FROM_EMAIL" "$gmail_user"
        
        echo "✅ Gmail configuration saved!"
        ;;
    2)
        echo ""
        read -p "Enter your Outlook email: " outlook_user
        read -sp "Enter your password: " outlook_pass
        echo ""
        
        update_env "SMTP_HOST" "smtp-mail.outlook.com"
        update_env "SMTP_PORT" "587"
        update_env "SMTP_SECURE" "false"
        update_env "SMTP_USER" "$outlook_user"
        update_env "SMTP_PASS" "$outlook_pass"
        update_env "SMTP_FROM_NAME" "MstryNote"
        update_env "SMTP_FROM_EMAIL" "$outlook_user"
        
        echo "✅ Outlook configuration saved!"
        ;;
    3)
        echo ""
        echo "SendGrid Setup:"
        echo "1. Sign up at https://sendgrid.com"
        echo "2. Create an API Key"
        echo ""
        read -p "Enter your SendGrid API Key: " sendgrid_key
        read -p "Enter verified sender email: " sendgrid_email
        
        update_env "SMTP_HOST" "smtp.sendgrid.net"
        update_env "SMTP_PORT" "587"
        update_env "SMTP_SECURE" "false"
        update_env "SMTP_USER" "apikey"
        update_env "SMTP_PASS" "$sendgrid_key"
        update_env "SMTP_FROM_NAME" "MstryNote"
        update_env "SMTP_FROM_EMAIL" "$sendgrid_email"
        
        echo "✅ SendGrid configuration saved!"
        ;;
    4)
        echo ""
        echo "Mailtrap Setup:"
        echo "Sign up at https://mailtrap.io and get credentials"
        echo ""
        read -p "Enter Mailtrap username: " mailtrap_user
        read -sp "Enter Mailtrap password: " mailtrap_pass
        echo ""
        
        update_env "SMTP_HOST" "smtp.mailtrap.io"
        update_env "SMTP_PORT" "2525"
        update_env "SMTP_SECURE" "false"
        update_env "SMTP_USER" "$mailtrap_user"
        update_env "SMTP_PASS" "$mailtrap_pass"
        update_env "SMTP_FROM_NAME" "MstryNote"
        update_env "SMTP_FROM_EMAIL" "test@example.com"
        
        echo "✅ Mailtrap configuration saved!"
        ;;
    5)
        echo ""
        echo "Custom SMTP Setup:"
        read -p "SMTP Host: " custom_host
        read -p "SMTP Port (587): " custom_port
        custom_port=${custom_port:-587}
        read -p "Use SSL/TLS? (true/false): " custom_secure
        read -p "SMTP Username: " custom_user
        read -sp "SMTP Password: " custom_pass
        echo ""
        read -p "From Email: " custom_from
        
        update_env "SMTP_HOST" "$custom_host"
        update_env "SMTP_PORT" "$custom_port"
        update_env "SMTP_SECURE" "$custom_secure"
        update_env "SMTP_USER" "$custom_user"
        update_env "SMTP_PASS" "$custom_pass"
        update_env "SMTP_FROM_NAME" "MstryNote"
        update_env "SMTP_FROM_EMAIL" "$custom_from"
        
        echo "✅ Custom SMTP configuration saved!"
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "Configuration complete! 🎉"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Test by registering a new user"
echo ""
echo "Check EMAIL_SETUP.md for troubleshooting tips."
