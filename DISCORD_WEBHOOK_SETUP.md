# Discord Webhook Setup Guide

## 🎯 How to Get Form Submissions in Discord

Get instant notifications in your Discord server whenever someone fills out the form!

---

## 📋 Step-by-Step Setup

### Step 1: Create Discord Webhook

1. **Open Discord** and go to your server
2. **Right-click** on the channel where you want notifications (e.g., #leads or #applications)
3. Click **"Edit Channel"**
4. Go to **"Integrations"** tab
5. Click **"Create Webhook"** or **"View Webhooks"**
6. Click **"New Webhook"**
7. **Name it** (e.g., "Work From Home Bot")
8. **Copy the Webhook URL** (looks like: `https://discord.com/api/webhooks/...`)

### Step 2: Add Webhook to Your Code

1. Open `script.js`
2. Find this line (around line 295):
   ```javascript
   const DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL_HERE';
   ```
3. Replace `YOUR_DISCORD_WEBHOOK_URL_HERE` with your actual webhook URL:
   ```javascript
   const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1234567890/abcdefghijklmnop';
   ```

### Step 3: Save and Test

1. **Save** the `script.js` file
2. **Refresh** your landing page
3. **Fill out the form** with test data
4. **Submit** the form
5. **Check your Discord channel** - you should see a beautiful embed message!

---

## 🎨 What You'll See in Discord

When someone submits the form, you'll get a **rich embed message** with:

- 🎯 **Title**: "New Application Received!"
- 📋 **Application ID**: Unique identifier
- 👤 **Full Name**: Applicant's name
- 📱 **Mobile Number**: With WhatsApp format
- 📧 **Email**: Contact email
- 📍 **Location**: City/State
- 🎂 **Age Group**: Selected age range
- ⏰ **Availability**: Part-time or Full-time
- 📱 **Smartphone**: Yes/No
- 🌐 **Internet**: Yes/No
- 💭 **Motivation**: Why they want to work from home
- 🕐 **Timestamp**: When the form was submitted

---

## 🔧 Customization Options

### Change Bot Name and Avatar

In `script.js`, find the `sendToDiscord` function and modify:

```javascript
const discordPayload = {
    username: 'Your Bot Name',  // Change this
    avatar_url: 'https://your-image-url.com/avatar.png',  // Change this
    embeds: [...]
};
```

### Change Embed Color

Find this line:
```javascript
color: 3447003, // Blue color
```

Replace with:
- **Green**: `3066993`
- **Red**: `15158332`
- **Purple**: `10181046`
- **Orange**: `15105570`
- **Yellow**: `16776960`

### Add More Fields

Add additional fields in the `fields` array:
```javascript
{
    name: '🏷️ Field Name',
    value: 'Field Value',
    inline: true  // true = side by side, false = full width
}
```

---

## 🔔 Discord Notification Settings

### Enable Notifications

1. Right-click your server icon
2. **Notification Settings**
3. Make sure notifications are enabled for the channel

### Mention Roles (Optional)

To ping a role when form is submitted, modify the Discord payload:

```javascript
const discordPayload = {
    content: '<@&ROLE_ID>',  // Add this line to mention a role
    username: 'Work From Home Bot',
    // ... rest of the code
};
```

To get Role ID:
1. Discord Settings → Advanced → Enable Developer Mode
2. Right-click the role → Copy ID

---

## 🛡️ Security Best Practices

### ⚠️ Important: Protect Your Webhook URL

**Never share your webhook URL publicly!** Anyone with the URL can send messages to your Discord channel.

### For Production:

1. **Use Environment Variables** (if using a backend)
2. **Add Rate Limiting** to prevent spam
3. **Validate Data** before sending to Discord
4. **Use a Backend Proxy** instead of exposing webhook in client-side code

### Better Approach (Recommended for Production):

Instead of putting the webhook URL in client-side code, create a simple backend:

```javascript
// In your backend (Node.js example)
app.post('/api/submit-form', async (req, res) => {
    const formData = req.body;
    
    // Send to Discord
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
    });
    
    res.json({ success: true });
});
```

Then in your `script.js`:
```javascript
fetch('/api/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

---

## 🎯 Multiple Webhooks (Optional)

You can send to multiple Discord channels:

```javascript
const WEBHOOKS = [
    'https://discord.com/api/webhooks/123/abc',  // Main channel
    'https://discord.com/api/webhooks/456/def'   // Backup channel
];

function sendToDiscord(formData) {
    const promises = WEBHOOKS.map(url => 
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
        })
    );
    
    return Promise.all(promises);
}
```

---

## 📊 Combine with Google Sheets

You can use **both** Discord webhooks AND Google Sheets:

```javascript
function handleFormSubmit(e) {
    // ... validation code ...
    
    // Send to Discord
    sendToDiscord(formData);
    
    // Also send to Google Sheets
    sendToGoogleSheets(formData);
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
}
```

---

## 🐛 Troubleshooting

### Not Receiving Messages?

1. **Check webhook URL** - Make sure it's correct
2. **Check channel permissions** - Webhook needs permission to post
3. **Check browser console** - Look for errors (F12)
4. **Test webhook** - Use a tool like Postman or curl

### Test Your Webhook Manually:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```

### Webhook Deleted?

If someone deletes the webhook in Discord, create a new one and update the URL in your code.

---

## ✅ You're All Set!

Once configured, you'll get instant, beautiful notifications in Discord every time someone submits the form! 🎉

**Questions?** Check the Discord Developer Documentation: https://discord.com/developers/docs/resources/webhook
