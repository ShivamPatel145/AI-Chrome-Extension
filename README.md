# LinkedIn Cover Letter Generator

A powerful Chrome extension that generates personalized cover letters for LinkedIn job applications using AI (Gemini API).

## 🎯 Features

- **AI-Powered Generation**: Uses Google's Gemini API to generate customized cover letters
- **LinkedIn Integration**: Seamlessly integrates with LinkedIn's job pages
- **Profile Management**: Store and manage your professional profile information
- **Quick Access**: Access the generator via a convenient popup interface
- **Responsive UI**: Built with React and Tailwind CSS for a smooth user experience
- **Real-time Notifications**: Toast notifications for user feedback

## 📋 Table of Contents

- [Installation](#installation)
- [Development Setup](#development-setup)
- [Building the Extension](#building-the-extension)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### From Chrome Web Store (If Published)
1. Visit the Chrome Web Store
2. Search for "LinkedIn Cover Letter Generator"
3. Click "Add to Chrome"
4. Grant the required permissions

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/ShivamPatel145/AI-Chrome-Extension.git
   cd AI-Chrome-Extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build:ext
   ```

4. Open Chrome and navigate to `chrome://extensions/`

5. Enable **Developer mode** (toggle in the top right corner)

6. Click **Load unpacked** and select the `build/` folder

7. The extension will now appear in your Chrome toolbar!

## 💻 Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Chrome browser

### Setup Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. For local testing, load the `public/` folder as an unpacked extension in Chrome

## 🔨 Building the Extension

Build the extension for production:
```bash
npm run build:ext
```

This command:
- Builds the React application
- Copies the manifest file
- Copies background and content scripts
- Creates an optimized build in the `build/` folder

## ⚙️ Configuration

### Setting Up Gemini API

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Store the API key in the extension's local storage:
   - Open the extension popup
   - Navigate to the Profile section
   - Enter your Gemini API key

3. The extension will securely store your API key in Chrome's local storage

### Manifest Configuration

The extension is configured as a **Manifest V3** Chrome extension with:
- **Popup**: React UI for user interaction
- **Content Scripts**: Runs on LinkedIn job pages
- **Background Service Worker**: Handles API requests and background tasks
- **Permissions**: Storage for local data and LinkedIn/API access

## 📖 Usage

### For End Users

1. **Load your Profile**:
   - Click the extension icon in your Chrome toolbar
   - Go to the "Profile" tab
   - Enter your professional information (skills, experience, etc.)
   - Enter your Gemini API key
   - Save your profile

2. **Generate a Cover Letter**:
   - Browse to a LinkedIn job posting
   - Click the extension icon in your toolbar
   - Go to the "Generator" tab
   - Review the job details
   - Click "Generate Cover Letter"
   - The AI will create a personalized cover letter based on your profile and the job description

3. **Copy and Use**:
   - Copy the generated cover letter
   - Paste it into your application

### For Developers

The extension uses the following main components:

- **CoverLetterGenerator**: Main component for generating cover letters
- **Profile**: Component for managing user profile and settings
- **geminiApi**: Utility for communicating with Gemini API
- **localStorage**: Utility for persisting profile data
- **constants**: Application constants

## 📁 Project Structure

```
AI-Chrome-Extension/
├── public/                    # Static files for the extension
│   ├── manifest.json         # Chrome extension manifest
│   ├── background.js         # Background service worker
│   ├── content.js            # Content script for LinkedIn pages
│   └── index.html            # Popup HTML
├── src/                       # React source code
│   ├── App.js               # Main React component
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles
│   ├── pages/
│   │   ├── CoverLetterGenerator.jsx  # Cover letter generation UI
│   │   └── Profile.jsx              # Profile management UI
│   └── utils/
│       ├── constants.js     # Application constants
│       ├── geminiApi.js     # Gemini API integration
│       └── localStorage.js  # Local storage utilities
├── build/                     # Built extension (generated)
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md               # This file
```

## 🛠️ Technologies Used

- **React** (v18.2.0) - UI library
- **React DOM** (v18.2.0) - DOM rendering
- **Tailwind CSS** (v3.3.1) - Utility-first CSS framework
- **React Toastify** (v9.1.2) - Toast notifications
- **React Icons** (v4.8.0) - Icon library
- **WebExtension Polyfill** (v0.10.0) - Cross-browser compatibility
- **React Scripts** (v5.0.1) - Build tooling

## 🔒 Security & Privacy

- API keys are stored locally in Chrome's secure storage
- No data is sent to external servers except for Gemini API requests
- Content scripts only run on LinkedIn job pages

## 🐛 Troubleshooting

### Extension not loading?
- Ensure Developer mode is enabled in `chrome://extensions/`
- Try clicking the refresh button on the extension card
- Check the console for error messages in DevTools

### Cover letter generation fails?
- Verify your Gemini API key is valid
- Check your API key has quota remaining
- Ensure you have a stable internet connection

### Profile data not saving?
- Clear your browser cache and reload the extension
- Check if Chrome allows local storage for extensions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Made with ❤️ by Shivam Patel**