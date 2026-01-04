# Form Data Collection Guide

## 🎯 How to Collect Form Submissions

Currently, form data is stored in **localStorage** (browser only). Here are 3 ways to collect real submissions:

---

## ✅ Option 1: Google Sheets (RECOMMENDED - Easiest)

### Using SheetDB (Free)

**Step 1: Create Google Sheet**
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add these column headers in Row 1:
   ```
   Timestamp | Full Name | Mobile | Email | Location | Age Group | Availability | Smartphone | Internet | Motivation | Application ID
   ```

**Step 2: Connect to SheetDB**
1. Go to [SheetDB.io](https://sheetdb.io)
2. Sign up for free account
3. Click "Create Database"
4. Paste your Google Sheet URL
5. Copy the API endpoint (looks like: `https://sheetdb.io/api/v1/xxxxx`)

**Step 3: Update Your Code**

Open `script.js` and find the `handleFormSubmit` function (around line 243).

Replace this section:
```javascript
// Simulate API call (replace with actual backend integration)
setTimeout(() => {
    console.log('Form submitted:', formData);
    
    // Store data in localStorage for demo purposes
    localStorage.setItem('applicationData', JSON.stringify(formData));
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
}, 2000);
```

With this:
```javascript
// Generate application ID
const applicationId = generateApplicationId();
formData.applicationId = applicationId;

// Send to Google Sheets via SheetDB
fetch('https://sheetdb.io/api/v1/YOUR_API_KEY_HERE', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        data: [{
            timestamp: formData.timestamp,
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
            location: formData.location,
            ageGroup: formData.ageGroup,
            availability: formData.availability,
            smartphone: formData.smartphone ? 'Yes' : 'No',
            internet: formData.internet ? 'Yes' : 'No',
            motivation: formData.motivation,
            applicationId: applicationId
        }]
    })
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
    
    // Store data in localStorage for thank you page
    localStorage.setItem('applicationData', JSON.stringify(formData));
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
})
.catch((error) => {
    console.error('Error:', error);
    alert('Submission failed. Please try again.');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
});
```

**Done!** Form submissions will now appear in your Google Sheet automatically.

---

## ✅ Option 2: Email Notifications (Simple)

### Using Formspree (Free - 50 submissions/month)

**Step 1: Sign up**
1. Go to [Formspree.io](https://formspree.io)
2. Create free account
3. Create a new form
4. Copy your form endpoint

**Step 2: Update Code**

Replace the same section in `script.js` with:
```javascript
// Generate application ID
const applicationId = generateApplicationId();
formData.applicationId = applicationId;

// Send via Formspree
fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    // Store data in localStorage for thank you page
    localStorage.setItem('applicationData', JSON.stringify(formData));
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
})
.catch((error) => {
    console.error('Error:', error);
    alert('Submission failed. Please try again.');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
});
```

You'll receive an email for each submission!

---

## ✅ Option 3: Firebase (Professional - Free Tier)

### Using Firebase Firestore

**Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Add a web app
4. Enable Firestore Database

**Step 2: Add Firebase to Your Project**

Add this to `index.html` before closing `</body>`:
```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script>
    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
</script>
```

**Step 3: Update Code**

Replace the section in `script.js`:
```javascript
// Generate application ID
const applicationId = generateApplicationId();
formData.applicationId = applicationId;

// Save to Firebase
db.collection('applications').add(formData)
    .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        
        // Store data in localStorage for thank you page
        localStorage.setItem('applicationData', JSON.stringify(formData));
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    })
    .catch((error) => {
        console.error('Error adding document: ', error);
        alert('Submission failed. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });
```

**View Submissions:**
Go to Firebase Console → Firestore Database → applications collection

---

## 📧 Bonus: Send Email Notifications

### Using EmailJS (Free - 200 emails/month)

**Step 1: Setup EmailJS**
1. Go to [EmailJS.com](https://www.emailjs.com)
2. Create account
3. Add email service (Gmail, Outlook, etc.)
4. Create email template
5. Get your Service ID, Template ID, and Public Key

**Step 2: Add EmailJS Script**

Add to `index.html` before closing `</head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_PUBLIC_KEY');
</script>
```

**Step 3: Send Email After Submission**

Add this after successful form submission:
```javascript
// Send email notification
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    to_email: 'your-email@example.com',
    from_name: formData.fullName,
    from_email: formData.email,
    mobile: formData.mobile,
    location: formData.location,
    age_group: formData.ageGroup,
    availability: formData.availability,
    motivation: formData.motivation,
    application_id: applicationId
});
```

---

## 🎯 My Recommendation

**For Quick Start:** Use **Option 1 (Google Sheets + SheetDB)**
- ✅ Free
- ✅ No coding required
- ✅ Easy to view/export data
- ✅ Works immediately

**For Professional Setup:** Use **Option 3 (Firebase)**
- ✅ Scalable
- ✅ Real-time database
- ✅ Can add authentication later
- ✅ Free tier is generous

---

## 📊 Viewing Your Data

### Google Sheets
- Open your Google Sheet
- All submissions appear as new rows
- Can export to Excel/CSV
- Can create charts and analytics

### Firebase
- Firebase Console → Firestore Database
- View all submissions
- Can export to JSON
- Can query and filter data

### Email
- Check your inbox
- Each submission = one email
- Can set up filters/labels

---

## 🔒 Security Note

**Important:** Never expose API keys in client-side code for production!

For production:
1. Use environment variables
2. Add domain restrictions in API settings
3. Use backend proxy for sensitive operations
4. Enable CORS properly

---

## 💡 Need Help?

If you want me to set up any of these options for you, just let me know which one you prefer and I'll update the code automatically!
