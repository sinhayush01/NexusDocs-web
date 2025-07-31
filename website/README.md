# Collaborative Rich Text Editor

A real-time collaborative rich text editor built with HTML, CSS, and JavaScript. Features include real-time collaboration simulation, rich text formatting, auto-save, and a modern responsive UI.

## Features

- ✨ **Rich Text Editing** - Bold, italic, underline, lists, alignment, colors
- 👥 **Real-time Collaboration** - Simulated multi-user editing experience
- 💾 **Auto-save** - Automatic document saving every 30 seconds
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS
- 🔗 **Link & Image Support** - Insert links and images easily
- 📊 **Live Statistics** - Character, word, and line count
- 🔔 **Notifications** - Real-time status updates and alerts

## Quick Start

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start editing and see the collaborative features in action!

## Free Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub Repository:**
   - Go to [GitHub](https://github.com) and sign in
   - Click "New repository"
   - Name it `collaborative-editor`
   - Make it public
   - Click "Create repository"

2. **Upload Your Files:**
   ```bash
   # Clone the repository
   git clone https://github.com/YOUR_USERNAME/collaborative-editor.git
   cd collaborative-editor
   
   # Copy your files to the repository
   # (index.html, script.js, styles.css, README.md)
   
   # Add and commit files
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at: `https://YOUR_USERNAME.github.io/collaborative-editor`

### Option 2: Netlify (Drag & Drop)

1. Go to [Netlify](https://netlify.com) and sign up
2. Drag and drop your project folder to the Netlify dashboard
3. Your site will be deployed instantly with a random URL
4. You can customize the URL in the site settings

### Option 3: Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository or upload files
4. Deploy with one click

### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## File Structure

```
collaborative-editor/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # Custom CSS styles
└── README.md           # This file
```

## How It Works

- **Frontend Only**: This is a client-side application that simulates real-time collaboration
- **Local Storage**: Documents are saved to browser's localStorage
- **Simulated Collaboration**: The app simulates other users joining and typing
- **Rich Text**: Uses browser's contentEditable API for rich text editing

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

You can customize the editor by modifying:
- `styles.css` - Change colors, fonts, and layout
- `script.js` - Add new features or modify existing ones
- `index.html` - Update the structure and content

## Future Enhancements

To make this a fully functional collaborative editor, you would need:
- Backend server (Node.js, Python, etc.)
- WebSocket server for real-time communication
- Database for document storage
- User authentication system

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Deployed Example**: [View Live Demo](https://your-username.github.io/collaborative-editor) 