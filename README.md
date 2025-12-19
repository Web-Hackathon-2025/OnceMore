# Local Services App - Service Provider Side

A modern, professional React frontend application for service providers to manage their business, services, bookings, and earnings.

## Features

### Provider Dashboard
- Overview of earnings, bookings, and performance metrics
- Recent bookings with status indicators
- Upcoming schedule view
- Quick action cards

### Manage Services
- Add, edit, and delete services
- Set pricing (fixed or hourly)
- Configure service duration and descriptions
- Organize by categories

### Bookings Management
- View all service requests
- Filter by status (Pending, Confirmed, In Progress, Completed)
- Accept or decline booking requests
- Update booking status
- View customer details and service descriptions

### Availability Management
- Set weekly working hours
- Configure availability for each day
- View upcoming appointments
- Manage schedule conflicts

### Earnings & Analytics
- Track total earnings and revenue
- View monthly earnings trends
- Recent transaction history
- Performance summary and statistics
- Export earnings reports

### Profile Settings
- Manage business information
- Update contact details
- Add credentials and certifications
- Edit business description

## Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **React Icons** - Icon library
- **CSS3** - Styling with CSS variables

## Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── Navbar.jsx
│       └── Navbar.css
├── pages/
│   ├── ProviderDashboard.jsx
│   ├── ProviderDashboard.css
│   ├── ManageServices.jsx
│   ├── ManageServices.css
│   ├── BookingsManagement.jsx
│   ├── BookingsManagement.css
│   ├── Availability.jsx
│   ├── Availability.css
│   ├── Earnings.jsx
│   ├── Earnings.css
│   ├── ProfileSettings.jsx
│   └── ProfileSettings.css
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Routes

- `/` or `/dashboard` - Provider Dashboard
- `/services` - Manage Services
- `/bookings` - Bookings Management
- `/availability` - Availability Settings
- `/earnings` - Earnings & Analytics
- `/profile` - Profile Settings

## Design Features

- **Modern UI** - Clean, professional design with smooth transitions
- **Responsive** - Works on desktop, tablet, and mobile devices
- **Color Scheme** - Primary indigo, success green, warning amber
- **Typography** - System font stack for optimal performance
- **Icons** - Feather icons (react-icons/fi)
- **Shadows & Borders** - Subtle depth and separation
- **Hover Effects** - Interactive feedback on clickable elements

## Backend Integration

This frontend is ready to be integrated with your MERN backend. Replace mock data with API calls:

1. **API Endpoints Needed:**
   - `GET /api/provider/profile` - Get provider profile
   - `PUT /api/provider/profile` - Update profile
   - `GET /api/provider/services` - List services
   - `POST /api/provider/services` - Create service
   - `PUT /api/provider/services/:id` - Update service
   - `DELETE /api/provider/services/:id` - Delete service
   - `GET /api/provider/bookings` - Get bookings
   - `PUT /api/provider/bookings/:id` - Update booking status
   - `GET /api/provider/earnings` - Get earnings data
   - `PUT /api/provider/availability` - Update availability

2. **Authentication:**
   - Add authentication context/provider
   - Protect routes with authentication checks
   - Include auth tokens in API requests

3. **State Management:**
   - Consider adding Redux or Context API for global state
   - Manage provider session and data state

## Customization

- **Colors**: Modify CSS variables in `src/index.css`
- **Styling**: Each component has its own CSS file
- **Icons**: Replace react-icons with your preferred icon library
- **Layout**: Adjust grid layouts and breakpoints in CSS files

## Next Steps

1. Set up authentication flow
2. Connect to backend API
3. Add loading states and error handling
4. Implement real-time updates for bookings
5. Add image uploads for profile and services
6. Implement payment processing integration
7. Add notifications for new bookings
8. Implement calendar view for availability

## License

MIT
