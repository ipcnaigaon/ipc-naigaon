# Indian Pentecostal Church of God - Bethel Church, Naigaon East - Admin Dashboard

A professional React-based admin dashboard for managing church operations including members, events, donations, and more.

**Church:** Indian Pentecostal Church of God - Bethel Church, Naigaon East  
**Pastor:** Pr. Jobin Alisha

## Features

✅ **User Authentication** - Secure login with Firebase Authentication  
✅ **Dashboard Overview** - Key metrics, charts, and recent activities  
✅ **Member Management** - Add, edit, delete, search, and filter members  
✅ **Member Portal Access** - Generate secure credentials for members  
✅ **Event Management** - Create and manage church events with calendar view  
✅ **Donation Tracking** - Track donations with Indian payment methods (UPI, Net Banking, etc.)  
✅ **Member Portal** - Dedicated portal for members with donation capabilities  
✅ **Notifications** - Real-time notification system  
✅ **Responsive Design** - Mobile-friendly interface  
✅ **Data Visualization** - Charts for donations and member growth  
✅ **Settings** - Profile and password management  
✅ **Firebase Integration** - Cloud-based data storage and real-time sync  

## Tech Stack

- **React 19.2.3** - UI framework
- **React Router 7.10.1** - Navigation
- **Redux Toolkit 2.11.2** - State management
- **Chart.js 4.5.1** - Data visualization
- **Firebase** - Backend, authentication, and database
- **Axios 1.13.2** - HTTP client
- **date-fns 4.1.0** - Date utilities

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (free tier available)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up Firebase** (Choose one option)

   **Option A: Use Mock Data (Development)**
   - No setup needed, works out of the box
   - Uses local mock data
   - Good for testing and development

   **Option B: Use Firebase (Production)**
   - Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Create a Firebase project
   - Configure `.env` with your Firebase credentials
   - Run migration script to seed data:
     ```bash
     node src/scripts/migrateToFirebase.js
     ```
   - Update service imports to use Firebase:
     ```bash
     ./switch-to-firebase.sh
     ```

3. **Start the development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Demo Credentials

**Admin Login:**  
**Email:** admin@christag.com  
**Password:** admin123

**Member Portal Login (after data migration):**  
**Username:** john1  
**Password:** Welcome@2020

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `node src/scripts/migrateToFirebase.js` - Migrate sample data to Firebase

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Login and authentication
│   ├── dashboard/       # Main dashboard
│   ├── members/         # Member management
│   ├── events/          # Event management
│   ├── donations/       # Donation tracking
│   ├── member-portal/   # Member portal components
│   ├── notifications/   # Notification system
│   └── settings/        # Settings pages
├── redux/               # Redux slices and store
├── services/            # API services (mock and Firebase)
│   ├── *.js             # Mock services (local development)
│   └── *.firebase.js    # Firebase services (production)
├── config/              # Configuration files
│   └── firebase.js      # Firebase initialization
├── scripts/             # Utility scripts
│   └── migrateToFirebase.js  # Data migration script
└── App.js               # Main app component
```

## Features in Detail

### Admin Dashboard
- View key metrics and statistics
- Recent activities and notifications
- Member growth and donation charts
- Quick access to all features

### Member Management
- Complete CRUD operations
- Advanced search and filtering
- Generate portal credentials
- Reset passwords and revoke access
- Track membership types and status

### Member Portal
- Secure login for members
- Personal dashboard
- Make donations with multiple payment methods:
  - UPI (Google Pay, PhonePe, Paytm, BHIM)
  - Credit/Debit Cards
  - Net Banking (all major Indian banks)
  - Paytm Wallet
  - Razorpay
  - Cash donations
- View donation history
- Download receipts

### Event Management
- Create and edit events
- Calendar view
- Track attendees
- Categorize events (worship, fellowship, prayer, etc.)

### Donation System
- Multiple payment methods (Indian gateways)
- Donation categories (Tithe, Offering, Building Fund, Mission)
- Comprehensive donation history
- Export capabilities
- Real-time statistics

### Indian Payment Integration
- **UPI**: Google Pay, PhonePe, Paytm UPI, BHIM UPI, Amazon Pay
- **Net Banking**: SBI, HDFC, ICICI, Axis, PNB, Canara Bank
- **Digital Wallets**: Paytm
- **Payment Gateway**: Razorpay integration ready
- **Currency**: Indian Rupees (₹)

## Firebase Collections

The app uses the following Firestore collections:

- `users` - Admin and user accounts
- `members` - Church members data
- `events` - Church events and activities
- `donations` - Donation records and history
- `notifications` - System notifications

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed schema information.

## Switching Between Mock and Firebase

### Using Mock Data (Default)
No configuration needed. The app works with local mock data out of the box.

### Switching to Firebase
Run the provided script:
```bash
./switch-to-firebase.sh
```

This automatically updates all service imports throughout the application.

### Manual Switch
Replace import statements from:
```javascript
import memberService from '../services/memberService';
```
To:
```javascript
import memberService from '../services/memberService.firebase';
```

## Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Other Platforms
The built files in the `build/` directory can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

## Security Notes

- Never commit `.env` files to version control
- Use Firebase Security Rules in production
- Enable Firebase App Check for additional security
- Regularly update dependencies
- Use environment-specific configurations

## Support and Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete Firebase integration guide
- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
