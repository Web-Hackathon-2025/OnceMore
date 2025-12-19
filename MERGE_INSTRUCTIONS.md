# Merge Instructions for Customer-Side Developer

## How to Integrate Provider-Side Code

### Step 1: Merge Dependencies

**In `package.json`:**
The dependencies should be the same, but verify:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-icons": "^4.12.0",
    "axios": "^1.6.2"
  }
}
```

### Step 2: Organize File Structure

**Option A: Keep Separate (Recommended)**
```
src/
├── pages/
│   ├── customer/          # Customer pages
│   │   ├── CustomerDashboard.jsx
│   │   ├── BrowseProviders.jsx
│   │   └── ...
│   └── provider/          # Provider pages
│       ├── ProviderDashboard.jsx
│       ├── ManageServices.jsx
│       └── ...
├── components/
│   └── Layout/
│       ├── CustomerNavbar.jsx
│       └── ProviderNavbar.jsx
```

**Option B: Use Route Prefixes**
Keep files as-is, but use route prefixes:
- Customer: `/customer/*` or `/` 
- Provider: `/provider/*`

### Step 3: Update App.jsx

Combine routes from both sides:

```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Customer imports
import CustomerDashboard from "./pages/CustomerDashboard";
import BrowseProviders from "./pages/BrowseProviders";
// ... other customer imports

// Provider imports
import ProviderDashboard from "./pages/ProviderDashboard";
import ManageServices from "./pages/ManageServices";
// ... other provider imports

function App() {
  // Determine user type (customer or provider)
  const userType = localStorage.getItem('userType'); // or from auth context
  
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/browse" element={<BrowseProviders />} />
        {/* ... other customer routes */}
        
        {/* Provider Routes */}
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/services" element={<ManageServices />} />
        <Route path="/provider/bookings" element={<BookingsManagement />} />
        {/* ... other provider routes */}
      </Routes>
    </Router>
  );
}
```

### Step 4: Handle Navigation

**Option A: Conditional Navbar**
```jsx
// In App.jsx or Layout component
{userType === 'customer' ? <CustomerNavbar /> : <ProviderNavbar />}
```

**Option B: Separate Layouts**
Create separate layout components for each side.

### Step 5: Merge API Utilities

In `src/utils/api.js`, combine both:

```jsx
// Customer APIs
export const getProviders = async (params = {}) => { ... }
export const getProviderById = async (id) => { ... }

// Provider APIs  
export const getProviderProfile = async () => { ... }
export const updateProviderProfile = async (profileData) => { ... }
// ... etc
```

### Step 6: Authentication

Set up authentication to determine user type:

```jsx
// After login
localStorage.setItem('userType', 'provider'); // or 'customer'
localStorage.setItem('token', response.data.token);
```

### Step 7: Test Both Sides

- Test customer routes work independently
- Test provider routes work independently  
- Test navigation between both sides
- Test authentication for both user types

## File Conflicts to Resolve

If there are conflicts in:
- `src/App.jsx` - Merge routes
- `src/main.jsx` - Usually no changes needed
- `src/index.css` - Merge CSS variables if different
- `package.json` - Merge dependencies

## Recommended Route Structure

```
Customer Side:
- / or /customer/dashboard
- /browse or /customer/browse
- /provider/:id
- /request/:providerId
- /bookings

Provider Side:
- /provider/dashboard
- /provider/services
- /provider/bookings
- /provider/availability
- /provider/earnings
- /provider/profile
```

