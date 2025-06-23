# DeliveryMatch - Frontend Application

A modern Angular application for connecting drivers with senders for efficient package delivery services.

## Features

### 🚀 Core Functionality

- **Role-based Authentication**: Secure login/register with JWT tokens
- **Multi-role Dashboard**: Different interfaces for Admins, Drivers, and Senders
- **Trip Management**: Create, edit, view, and manage delivery trips
- **Request System**: Send delivery requests and manage status updates
- **Admin Panel**: User management and system statistics
- **Data Visualization**: Interactive charts using Chart.js

### 👥 User Roles

**🔧 Admin**

- View system statistics and analytics
- Manage all users (activate/deactivate, verify)
- Oversee all trips and delivery requests
- Access comprehensive dashboard with charts

**🚛 Driver**

- Create and manage trips
- View delivery requests for their trips
- Accept/reject delivery requests
- Mark deliveries as completed
- Track trip statistics

**📦 Sender**

- Browse available trips
- Create delivery requests
- Track request status
- View personal delivery history

## Technology Stack

- **Frontend Framework**: Angular 18
- **UI Components**: Angular Material + Bootstrap 5
- **Charts**: Chart.js with ng2-charts
- **Styling**: SCSS with custom design system
- **Authentication**: JWT-based with HTTP interceptors
- **State Management**: RxJS Observables
- **Routing**: Angular Router with guards

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Angular CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd delivery-match
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Backend Integration

This frontend is designed to work with a Spring Boot backend API. Ensure your backend is running on `http://localhost:8080` with the following endpoints:

#### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/admin/users` - Get all users (Admin only)

#### Trip Management

- `GET /api/trips/available` - Get available trips
- `POST /api/trips/create` - Create new trip
- `GET /api/trips/my-trips` - Get user's trips
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

#### Delivery Requests

- `POST /api/requests/create` - Create delivery request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/for-my-trips` - Get requests for driver's trips
- `PUT /api/requests/{id}/status` - Update request status

## Project Structure

```
src/
├── app/
│   ├── components/          # Feature components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard component
│   │   ├── trips/          # Trip management components
│   │   ├── requests/       # Delivery request components
│   │   ├── admin/          # Admin panel components
│   │   └── shared/         # Shared components
│   ├── services/           # Angular services for API calls
│   ├── models/             # TypeScript interfaces and enums
│   ├── guards/             # Route guards for authentication
│   ├── interceptors/       # HTTP interceptors
│   └── app.routes.ts       # Application routing configuration
├── styles.scss             # Global styles and themes
└── index.html              # Main HTML template
```

## Key Features Implementation

### Authentication & Authorization

- JWT token-based authentication
- Role-based route protection
- Automatic token refresh
- Secure HTTP interceptors

### Responsive Design

- Mobile-first approach
- Bootstrap grid system
- Angular Material components
- Custom responsive utilities

### Data Visualization

- Real-time statistics dashboard
- Interactive charts with Chart.js
- Role-specific analytics
- Responsive chart containers

### User Experience

- Intuitive navigation
- Loading states and error handling
- Snackbar notifications
- Form validation
- Progressive enhancement

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
