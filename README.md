# UBLC-AI-Automation-TeamLibby

## 📋 Project Overview

**Libby** is an AI-powered library assistant chatbot designed for the University of Batangas Lipa Campus (UBLC). This intelligent automation system provides students and staff with instant access to library services, including book searches, library hours, borrowing rules, and discussion room bookings through an intuitive conversational interface.

### Team Composition

**Team Name:** TeamLibby



---

## ✨ Features

### Core Functionality
- 🤖 **AI Chat Assistant**: Interactive chatbot interface powered by intelligent response generation
- 📚 **Book Search**: Search and discover books from the library collection
- 🕐 **Library Hours**: Get real-time information about library operating hours and schedules
- 📖 **Borrowing Rules**: Access comprehensive borrowing policies and guidelines
- 🚪 **Discussion Room Booking**: Check availability and book discussion rooms
- 👤 **User Profiles**: Personalized user experience with profile management
- ⚙️ **Settings**: Customizable preferences and settings

### User Experience
- 🎨 **Modern UI**: Glassmorphism design with dark theme and yellow accent colors
- 📱 **Responsive Design**: Mobile-first approach with bottom navigation
- 🎯 **Onboarding Flow**: Guided introduction for new users
- 💬 **Quick Suggestions**: Pre-defined quick action buttons for common queries
- ⚡ **Real-time Typing Indicators**: Enhanced conversational experience

---

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for single-page application
- **TanStack Query (React Query)** - Data fetching and state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Lucide React** - Beautiful icon library

### Styling & Design
- **CSS3** - Custom styles with glassmorphism effects
- **Google Fonts (Nunito)** - Modern typography
- **CSS Variables** - Theming system for consistent design

### Development Tools
- **ESLint** - Code linting and quality assurance
- **GitHub Actions** - CI/CD pipeline automation
- **Super Linter** - Automated code quality checks

### Data & Storage
- **LocalStorage** - Client-side data persistence
- **Departmental Datasets** - Library, ICT, Admin, and Security data

---

## 📁 Repository Structure

```
UBLC-AI-Automation-TeamLibby/
├── frontend/ # Web interface files
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── hooks/ # Custom React hooks
│ │ └── lib/ # Utility functions
│ ├── index.html # Main HTML file
│ └── styles.css # Global styles
├── backend/ # AI and automation workflows
│ └── (2nd branch)
├── data/ # Departmental datasets
│ ├── library/ # Library-specific data
│ ├── ICT/ # ICT department data
│ ├── admin/ # Administrative data
│ └── security/ # Security department data
├── docs/ # Project documentation
│ ├── project-report/ # Project report
│ ├── presentation/ # Presentation materials
│ └── screenshots/ # Application screenshots
├── .github/
│ └── workflows/ # CI/CD pipeline configurations
│ └── super-linter.yml
└── README.md # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/UBLC-AI-Automation-TeamLibby.git
cd UBLC-AI-Automation-TeamLibby
```

2. **Navigate to the frontend directory**
```bash
cd frontend
```

3. **Install dependencies**
```bash
npm install
# or
yarn install
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
- Navigate to `http://localhost:5173` (or the port shown in terminal)
- The application should now be running locally

### Building for Production

```bash
npm run build
# or
yarn build
```

The production build will be generated in the `dist/` directory.

---

## 🚢 Deployment

### Deployment Options

#### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure build settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
4. Deploy

#### Option 2: Netlify
1. Push your code to GitHub
2. Import the repository in Netlify
3. Configure build settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
4. Deploy

#### Option 3: GitHub Pages
1. Install `gh-pages` package:
```bash
npm install --save-dev gh-pages
```
2. Add deploy script to `package.json`:
```json
"scripts": {
"deploy": "gh-pages -d dist"
}
```
3. Run deployment:
```bash
npm run build
npm run deploy
```

### Environment Variables
Create a `.env` file in the `frontend/` directory if needed:
```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=Libby
```

---

## 🔄 CI/CD Process

### GitHub Actions Workflow

The project uses **GitHub Actions** for continuous integration and continuous deployment (CI/CD).

#### Current Workflow: Super Linter

**Location:** `.github/workflows/super-linter.yml`

**Trigger Events:**
- Push to `main` branch
- Pull requests to `main` branch

**Process:**
1. **Checkout Code**: Retrieves the full git history
2. **Lint Code Base**: Runs automated linting using GitHub Super Linter
- Validates code quality across multiple languages
- Checks for syntax errors and code style violations
- Only lints changed files (not entire codebase)

**Linting Configuration:**
- **Default Branch**: `main`
- **Validation Scope**: Changed files only
- **Supported Languages**: Automatically detects based on file extensions

### Workflow Benefits
- ✅ Automated code quality checks
- ✅ Consistent coding standards
- ✅ Early detection of issues
- ✅ Improved code maintainability

### Adding More CI/CD Steps

To extend the CI/CD pipeline, you can add additional workflows:
- **Build and Test**: Run tests and build verification
- **Deploy**: Automatic deployment to staging/production
- **Security Scanning**: Dependency vulnerability checks

---

## 🎥 Live Demo

### Demo Links
- **Live Application**: [Add your deployment URL here]
- **Demo Video**: [Add link to demo video here]

### Screenshots
Screenshots of the application are available in the `/docs/screenshots/` directory.

---

## 👥 Team Member Roles



| Name | Role | Responsibilities |
|------|------|-----------------|
| John Rico Tolentino | Project Lead, Frontend Developer, UI/UX | Oversees the project and develops the responsive user interface. |
| Erik John Roxas | Backend Developer, Security | Designs backend automation and ensures data security. |
| John Vincent Ferrer | DevOps, Tester | Manages deployment, GitHub activity, and system testing. |

---

## 📝 Additional Information

### Project Status
- ✅ Frontend UI/UX implementation
- ✅ Chat interface with basic AI responses
- ✅ User onboarding flow
- ⏳ Backend AI integration (in progress)
- ⏳ Advanced automation workflows (planned)
- ⏳ Database integration (planned)

### Future Enhancements
- Integration with library management system
- Advanced AI/ML capabilities for better responses
- Real-time discussion room availability
- User authentication and authorization
- Analytics and reporting dashboard
- Multi-language support

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License
[Specify your license here]

### Contact
For questions or support, please contact the team or open an issue in the repository.

---

**Built with ❤️ by TeamLibby for University of Batangas Lipa Campus**
