# Uproom Dashboard

A modern team collaboration and productivity dashboard that provides real-time visibility into your team's availability, workload, and priorities. Built with React and designed to eliminate coordination overhead and improve team communication.

## 🚀 Features

### Team Visibility & Availability Tracking
- **Real-time availability status** - See who's in meetings, focused, or ready to collaborate
- **Activity insights** - Understand team workload patterns and peak productivity hours
- **Smart notifications** - Get alerts when key teammates become available
- **Timezone awareness** - Never accidentally ping someone at the wrong time

### Smart Communication & Nudges
- **Priority-based messaging** - Mark urgent requests that cut through the noise
- **Smart nudge system** - Gentle reminders that actually get responses
- **Targeted communication** - Send messages to specific team members or groups
- **Rich text editor** - Create formatted messages with mentions and rich content

### Schedule Management
- **Monthly calendar view** - Visual overview of team schedules and meetings
- **Meeting scheduling** - Find optimal time slots without back-and-forth emails
- **Employee availability** - Check when team members are free
- **Event details** - Comprehensive meeting information and management

### Team Management
- **User profiles** - Detailed team member information with skills and contact details
- **Group organization** - Create and manage teams by status, role, or custom criteria
- **Department views** - Organize team members by departments and roles
- **User status tracking** - Monitor online/offline status and last activity

### Task & Todo Management
- **Personal todos** - Individual task management with priorities
- **Team todos** - Shared tasks and project management
- **Progress tracking** - Visual progress indicators and completion status
- **Context linking** - Connect todos to events and meetings

### File Management
- **File sharing** - Upload and share files with team members
- **File organization** - Structured file management system
- **Access control** - Manage file permissions and sharing

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **UI Components**: 
  - Material-UI (MUI) for date pickers and core components
  - Headless UI for accessible components
  - Heroicons for iconography
  - Lucide React for additional icons
- **Rich Text Editing**: 
  - TipTap editor with mention support
  - Slate.js for advanced text editing
- **Drag & Drop**: @dnd-kit for sortable interfaces
- **Animations**: React Spring for smooth transitions
- **Date Management**: Day.js for date manipulation
- **State Management**: Zustand for lightweight state management
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uproom2
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
   Navigate to `http://localhost:3000` to view the application.

## 🚀 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Main dashboard components
│   ├── schedule/           # Calendar and scheduling features
│   ├── nudges/            # Communication and messaging
│   ├── todos/             # Task management
│   ├── team/              # Team member management
│   ├── files/             # File management
│   └── shared/            # Reusable UI components
├── data/
│   └── usersData.js       # Sample user data
├── hooks/
│   └── useEscapeKey.js    # Custom React hooks
├── store/
│   └── nudgeStore.js      # Zustand state management
└── utils/
    └── mentionUtils.js    # Utility functions
```

## 🎨 Key Components

### Dashboard
- **UserCard**: Individual team member cards with status and availability
- **UserDetails**: Detailed view of team member information
- **GroupViews**: Different ways to organize and view team members
- **ActionBar**: Quick actions and controls

### Schedule
- **MonthlyCalendar**: Full calendar view with events and availability
- **SchedulePage**: Main scheduling interface
- **EventDetailsSidebar**: Detailed event information and management
- **MeetingScheduling**: Step-by-step meeting creation workflow

### Communication
- **NudgePage**: Main messaging and communication interface
- **PollCreation**: Create polls and surveys for team input
- **RichTextEditor**: Advanced text editing with mentions

### Shared Components
- **Sidebar**: Main navigation sidebar
- **BottomSheet**: Mobile-friendly modal interfaces
- **LiveNotifications**: Real-time notification system

## 🔧 Configuration

### Environment Setup
- Node.js version specified in `.nvmrc`
- Tailwind CSS configuration in `tailwind.config.js`
- PostCSS configuration in `postcss.config.js`

### Deployment
- Netlify configuration available in `netlify.toml`
- Production build optimized for modern browsers

## 👥 Team Data Structure

The application uses a comprehensive user data model including:
- Personal information (name, title, avatar, contact details)
- Professional details (department, skills, role, join date)
- Availability status (online, offline, meeting, focus, etc.)
- Social links (GitHub, Twitter, Figma, Dribbble)
- Current work and bio information

## 🎯 Use Cases

1. **Team Coordination**: Quickly see who's available for urgent questions
2. **Meeting Planning**: Find optimal meeting times across time zones
3. **Project Management**: Track tasks and todos across team members
4. **Communication**: Send targeted messages that get responses
5. **Team Insights**: Understand team workload and availability patterns

## 🚀 Getting Started

1. **Dashboard Overview**: Start with the main dashboard to see team status
2. **Schedule Meetings**: Use the calendar to schedule team meetings
3. **Send Nudges**: Communicate with team members through the nudges system
4. **Manage Tasks**: Create and track todos for yourself and your team
5. **File Sharing**: Upload and share files with team members

## 📱 Responsive Design

The application is fully responsive and includes:
- Mobile-optimized interfaces with bottom sheets
- Touch-friendly interactions
- Adaptive layouts for different screen sizes
- Progressive web app capabilities

## 🔒 Security & Privacy

- No sensitive data stored in the repository
- Secure handling of user information
- Privacy-focused design with appropriate access controls

## 🤝 Contributing

This is a team productivity dashboard designed to improve collaboration and reduce coordination overhead. The application focuses on providing real-time visibility into team availability and streamlined communication workflows.

## 📄 License

Private project - All rights reserved.

---

**Uproom Dashboard** - Stop wasting time hunting down teammates. Start collaborating instantly.