# Service Provider Branch - Files to Push

## 📁 Files You Should Push to Your Branch

### ✅ Core Configuration Files (Coordinate with customer-side dev)
These files might need coordination if customer-side dev has different configs:

- `package.json` - **IMPORTANT**: Merge dependencies with customer-side
- `vite.config.js` - Usually same, but check
- `index.html` - Usually same
- `.gitignore` - Usually same

### ✅ Provider-Specific Files (Safe to push)
These are your unique files:

**Pages:**
- `src/pages/ProviderDashboard.jsx` & `.css`
- `src/pages/ManageServices.jsx` & `.css`
- `src/pages/BookingsManagement.jsx` & `.css`
- `src/pages/Availability.jsx` & `.css`
- `src/pages/Earnings.jsx` & `.css`
- `src/pages/ProfileSettings.jsx` & `.css`

**Components:**
- `src/components/Layout/Navbar.jsx` & `.css` (Provider Navbar)

**Utilities:**
- `src/utils/api.js` (You can merge provider endpoints with customer endpoints)

### ⚠️ Files That Need Coordination

**These files will need to be merged with customer-side:**

1. **`src/App.jsx`** - Routes need to be combined
   - Your routes: `/dashboard`, `/services`, `/bookings`, `/availability`, `/earnings`, `/profile`
   - Customer routes: `/customer-dashboard`, `/browse`, `/provider/:id`, etc.

2. **`src/main.jsx`** - Usually same, but verify

3. **`src/index.css`** - Usually same CSS variables, but verify

4. **`src/App.css`** - Usually minimal, but verify

## 🔀 Recommended Approach

### Option 1: Separate Route Prefixes (Recommended)
Use route prefixes to avoid conflicts:
- Provider routes: `/provider/dashboard`, `/provider/services`, etc.
- Customer routes: `/customer/dashboard`, `/customer/browse`, etc.

### Option 2: Separate Navbars
- Keep your Navbar in: `src/components/Layout/ProviderNavbar.jsx`
- Customer Navbar in: `src/components/Layout/CustomerNavbar.jsx`
- Use conditional rendering in App.jsx based on user role

### Option 3: Separate Apps (If completely separate)
- Provider: `src/provider/` folder
- Customer: `src/customer/` folder
- Shared: `src/shared/` folder

## 📋 Checklist Before Pushing

- [ ] All provider pages are in `src/pages/`
- [ ] Provider Navbar is separate from customer Navbar
- [ ] API utility has provider-specific endpoints
- [ ] Routes use unique paths (or prefixes)
- [ ] No conflicts with customer-side file names
- [ ] README.md documents provider-side features

## 🤝 Coordination Needed

**Talk to customer-side developer about:**

1. **Route structure** - How to organize routes
2. **Shared components** - Any components both sides need?
3. **API base URL** - Same backend, different endpoints?
4. **Authentication** - How to handle provider vs customer login
5. **Styling** - CSS variables and theme consistency

## 📝 Suggested Git Workflow

```bash
# On your provider branch
git add src/pages/Provider*.jsx src/pages/Provider*.css
git add src/pages/ManageServices.* src/pages/BookingsManagement.*
git add src/pages/Availability.* src/pages/Earnings.* src/pages/ProfileSettings.*
git add src/components/Layout/Navbar.*
git add src/utils/api.js
git commit -m "feat: Add service provider frontend pages and components"
git push origin provider-branch
```

## 🔄 When Customer-Side Dev Merges

They will need to:
1. Merge `package.json` dependencies
2. Combine routes in `App.jsx`
3. Keep both Navbars separate
4. Merge API utilities if needed
5. Test that both sides work independently

