// ===================================
// DISCORD WEBHOOK INTEGRATION
// Add this code to your script.js file
// ===================================

// Step 1: Add this function at the end of script.js (after the formatDate function)

function sendToDiscord(formData) {
    // Replace with your Discord webhook URL
    const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1457315208031637616/BfDApClPQ180G59B9W9Jti5KNtZNAyfwQH3I9HGJzouMG_oHTkNxYlqO9WLto9y5CwLu';

    // Skip if webhook URL not configured
    if (DISCORD_WEBHOOK_URL === 'https://discordapp.com/api/webhooks/1457315208031637616/BfDApClPQ180G59B9W9Jti5KNtZNAyfwQH3I9HGJzouMG_oHTkNxYlqO9WLto9y5CwLu') {
        console.log('Discord webhook not configured - skipping');
        return Promise.resolve();
    }

    // Format timestamp for display
    const submittedDate = new Date(formData.timestamp);
    const formattedDate = submittedDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create Discord embed message
    const discordPayload = {
        username: 'Work From Home Bot',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
        embeds: [{
            title: '🎯 New Application Received!',
            description: `**Application ID:** \`${formData.applicationId}\``,
            color: 3447003, // Blue color
            fields: [
                {
                    name: '👤 Full Name',
                    value: formData.fullName,
                    inline: true
                },
                {
                    name: '📱 Mobile Number',
                    value: formData.mobile,
                    inline: true
                },
                {
                    name: '📧 Email',
                    value: formData.email,
                    inline: false
                },
                {
                    name: '📍 Location',
                    value: formData.location,
                    inline: true
                },
                {
                    name: '🎂 Age Group',
                    value: formData.ageGroup,
                    inline: true
                },
                {
                    name: '⏰ Availability',
                    value: formData.availability.charAt(0).toUpperCase() + formData.availability.slice(1),
                    inline: true
                },
                {
                    name: '📱 Smartphone',
                    value: formData.smartphone ? '✅ Yes' : '❌ No',
                    inline: true
                },
                {
                    name: '🌐 Internet',
                    value: formData.internet ? '✅ Yes' : '❌ No',
                    inline: true
                },
                {
                    name: '💭 Motivation',
                    value: formData.motivation || '_Not provided_',
                    inline: false
                }
            ],
            footer: {
                text: `Submitted on ${formattedDate}`
            },
            timestamp: formData.timestamp
        }]
    };

    // Send to Discord
    return fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(discordPayload)
    });
}

// Step 2: Replace the handleFormSubmit function's setTimeout section with this:

/*
    // Generate application ID
    const applicationId = generateApplicationId();
    formData.applicationId = applicationId;
    
    // Send to Discord Webhook
    sendToDiscord(formData).then(() => {
        console.log('Form submitted successfully');
    }).catch((error) => {
        console.error('Discord webhook error:', error);
    }).finally(() => {
        // Store data in localStorage for thank you page
        localStorage.setItem('applicationData', JSON.stringify(formData));
        
        // Redirect to thank you page after 1 second
        setTimeout(() => {
            window.location.href = 'thank-you.html';
        }, 1000);
    });
}
*/
