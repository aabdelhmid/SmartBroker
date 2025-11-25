# SmartBroker - Real Estate Marketplace

A modern, full-featured real estate marketplace built with React and Vite, supporting bilingual content (English/Arabic) with a complete property management system.

## 🌟 Features

### Core Functionality
- **Property Listings**: Browse, search, and filter properties for sale and rent
- **User Roles**: Admin, Marketer, Developer, and Buyer with role-based permissions
- **Property Management**: Complete workflow for adding, editing, and managing properties
- **Admin Dashboard**: Comprehensive admin panel for property approvals and user management
- **Investment Scoring**: Smart algorithm to calculate property investment scores
- **Multi-Image Upload**: Support for up to 5 images per property with carousel display

### Bilingual Support
- **English & Arabic**: Full UI translation support
- **RTL Layout**: Automatic right-to-left layout for Arabic
- **Language Switcher**: Modern dropdown with flags and smooth transitions
- **Persistent Preference**: Language choice saved in localStorage

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Sticky Header**: Navigation stays accessible while scrolling
- **User Dropdown**: Quick access to Dashboard, Profile, and Logout
- **Featured Properties**: Tabbed interface (All, Villas, Apartments)

### Property Features
- **Status Workflow**: Pending → Approved/Rejected/Needs Revision
- **Property Types**: Villa, Apartment, Office, Land
- **Advanced Search**: Filter by status, type, price range, location
- **Price Formatting**: Egyptian Pounds (EGP) with smart formatting (1.2 Million EGP)
- **Image Carousel**: Interactive gallery for property photos

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smartbroker.git
cd smartbroker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Header with navigation and dropdowns
│   ├── Hero.jsx        # Landing page hero section
│   ├── PropertyCard.jsx # Property display card
│   ├── LanguageSwitcher.jsx # Language selection dropdown
│   └── ErrorBoundary.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Buy.jsx
│   ├── Rent.jsx
│   ├── PropertyDetails.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── AddProperty.jsx
│   └── Profile.jsx
├── context/            # React Context for state management
│   └── AuthContext.jsx # Authentication and global state
├── utils/              # Utility functions
│   ├── scoring.js      # Investment score calculation
│   ├── formatPrice.js  # Price formatting (EGP)
│   └── translation.js  # Content translation helpers
├── i18n/               # Internationalization
│   └── config.js       # i18next configuration
├── locales/            # Translation files
│   ├── en.json         # English translations
│   └── ar.json         # Arabic translations
└── App.jsx             # Main application component
```

## 👥 User Roles

### Admin
- Email: `admin@smartbroker.com`
- Password: `admin123`
- **Permissions**: Approve/reject properties, manage users, full access

### Marketer/Developer
- **Permissions**: Add properties, view leads, edit own properties

### Buyer
- **Permissions**: Browse properties, show interest, view buyer score

## 🎨 Key Technologies

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **react-i18next**: Internationalization framework
- **localStorage**: Client-side data persistence
- **BroadcastChannel**: Cross-tab synchronization

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Bilingual Implementation

The application uses `react-i18next` for internationalization:

- Translation files: `/src/locales/en.json` and `/src/locales/ar.json`
- Language detection: Browser language or localStorage preference
- RTL support: Automatic layout flip for Arabic
- Fallback: English if translation missing

## 💾 Data Persistence

Currently uses `localStorage` for data persistence:

- Properties stored in `properties` key
- Users stored in `users` key
- Authentication state in `user` key
- Language preference in `i18nextLng` key

**Note**: For production use, connect to a real backend (Supabase, Firebase, or custom API).

## 🔐 Authentication Flow

1. User signs up with role selection (Buyer/Marketer/Developer)
2. Credentials validated and stored in localStorage
3. Login with email and password
4. Role-based access control for different features
5. Persistent session across page reloads

## 📊 Property Workflow

1. **Marketer adds property** → Status: Pending
2. **Admin reviews** → Approve/Reject/Send Back
3. **If Approved** → Visible to public
4. **If Sent Back** → Marketer can edit and resubmit
5. **If Rejected** → Not visible to public

## 🎯 Future Enhancements

- [ ] Connect to real backend/API
- [ ] Email notifications for status changes
- [ ] Map integration for property locations
- [ ] Advanced search filters
- [ ] User reviews and ratings
- [ ] Saved properties/favorites
- [ ] Property comparison feature
- [ ] Blog/content management

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact: [your-email@example.com]

---

**Built with ❤️ using React and Vite**
