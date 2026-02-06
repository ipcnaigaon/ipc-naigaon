# Firebase Integration Guide

This guide will help you set up Firebase for your Church Admin Dashboard.

## Prerequisites

- A Google account
- Node.js installed
- The church admin dashboard project

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `church-admin-dashboard` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the Web icon (`</>`)
2. Register app with nickname: "Church Admin Dashboard"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Enable Firebase Services

### Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Click "Save"

### Enable Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose your preferred location (closest to your users)
5. Click "Enable"

### Configure Firestore Security Rules (Optional - for production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Members collection - authenticated users can read, only admins can write
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Events collection - authenticated users can read, only admins can write
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Donations collection - authenticated users can read, only admins can write
    match /donations/{donationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Notifications collection - authenticated users can read their own
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 4: Configure Environment Variables

1. Open `.env` file in your project root
2. Replace the placeholder values with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

3. **Important**: Add `.env` to your `.gitignore` to keep credentials secure

## Step 5: Switch to Firebase Services

The project includes both mock services and Firebase services. To use Firebase:

### Update Service Imports

Replace the imports in your components from:
```javascript
import memberService from '../services/memberService';
```

To:
```javascript
import memberService from '../services/memberService.firebase';
```

Do this for all services:
- `memberService.firebase.js`
- `eventService.firebase.js`
- `donationService.firebase.js`
- `notificationService.firebase.js`
- `authService.firebase.js`

### Quick Update Script

You can use this find-and-replace pattern:
- Find: `from '../services/memberService'`
- Replace: `from '../services/memberService.firebase'`

Repeat for each service file.

## Step 6: Migrate Initial Data

Run the migration script to populate Firebase with sample data:

```bash
node src/scripts/migrateToFirebase.js
```

This will create:
- Admin user (admin@christag.com / admin123)
- 5 sample members
- 4 sample events
- 4 sample donations
- 3 sample notifications

## Step 7: Test the Application

1. Start your development server:
```bash
npm start
```

2. Login with admin credentials:
   - Email: `admin@christag.com`
   - Password: `admin123`

3. Test all features:
   - View members, events, donations
   - Create new records
   - Update existing records
   - Delete records

## Firebase Collections Structure

### Members Collection
```javascript
{
  name: string,
  email: string,
  phone: string,
  gender: string,
  dateOfBirth: string,
  address: string,
  joinDate: string,
  status: string,
  membershipType: string,
  hasPortalAccess: boolean,
  credentials: {
    username: string,
    password: string,
    temporaryPassword: boolean,
    lastPasswordChange: timestamp
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Events Collection
```javascript
{
  title: string,
  description: string,
  date: string,
  location: string,
  category: string,
  attendees: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Donations Collection
```javascript
{
  amount: number,
  donor: string,
  memberId: string,
  category: string,
  paymentMethod: string,
  date: string,
  status: string,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Notifications Collection
```javascript
{
  title: string,
  message: string,
  type: string,
  read: boolean,
  userId: string,
  createdAt: timestamp
}
```

### Users Collection
```javascript
{
  email: string,
  name: string,
  role: string, // 'admin' or 'user'
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Troubleshooting

### Error: "Firebase not initialized"
- Make sure `.env` file exists with correct values
- Restart your development server after updating `.env`

### Error: "Permission denied"
- Check Firestore security rules
- Ensure you're authenticated
- For development, you can use test mode

### Error: "Network request failed"
- Check your internet connection
- Verify Firebase project is active
- Check if API key is correct

### Migration Script Errors
- Ensure Firebase Auth is enabled
- Make sure Firestore is created
- Verify environment variables are set

## Production Deployment

Before deploying to production:

1. **Update Security Rules**: Replace test mode with proper security rules
2. **Enable App Check**: Protect against abuse
3. **Set up Billing**: Add payment method for scaling
4. **Enable Backup**: Set up automated backups
5. **Add Monitoring**: Enable Firebase Performance Monitoring
6. **Secure Environment Variables**: Use hosting platform's secrets management

## Cost Considerations

Firebase offers a generous free tier:
- **Authentication**: 50,000 MAUs free
- **Firestore**: 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day free
- **Storage**: 1 GB free

For most small churches, the free tier should be sufficient.

## Support

For Firebase documentation and support:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Next Steps

- Set up automated backups
- Configure email templates for password reset
- Add file upload for member photos
- Implement real-time updates with Firestore listeners
- Add push notifications
- Set up Firebase Cloud Functions for server-side logic
