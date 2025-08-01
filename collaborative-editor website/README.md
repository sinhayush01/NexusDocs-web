# Collaborative Rich Text Editor

A real-time collaborative rich text editor built with React.js, Node.js, Socket.io, and MongoDB. Multiple users can edit the same document simultaneously with live updates, typing indicators, and user presence.

## Features

- **Real-time Collaboration**: Multiple users can edit documents simultaneously
- **Rich Text Editing**: Full-featured text editor with formatting options
- **Live Typing Indicators**: See when other users are typing
- **User Presence**: View who is currently editing the document
- **Document Management**: Create, edit, and delete documents
- **Auto-save**: Changes are automatically saved to the database
- **Modern UI**: Clean and responsive design with Tailwind CSS
- **Real-time Cursor Tracking**: See other users' cursor positions (coming soon)

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **React Quill** - Rich text editor
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-rich-text-editor
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/collaborative-editor
   PORT=5000
   JWT_SECRET=your-secret-key-here
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Create a new document** by clicking the "New Document" button

3. **Start editing** - your changes will be saved automatically

4. **Share the document URL** with others to collaborate in real-time

5. **See real-time updates** as other users type and make changes

## API Endpoints

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create a new document
- `GET /api/documents/:id` - Get a specific document
- `PUT /api/documents/:id` - Update a document
- `DELETE /api/documents/:id` - Delete a document

### Real-time Events (Socket.io)
- `join-document` - Join a document room
- `text-change` - Broadcast text changes
- `cursor-move` - Broadcast cursor position
- `typing` - Broadcast typing status
- `user-joined` - Notify when user joins
- `user-left` - Notify when user leaves

## Project Structure

```
collaborative-rich-text-editor/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Features in Detail

### Real-time Collaboration
- Uses Socket.io for real-time bidirectional communication
- Changes are broadcasted to all connected users instantly
- Automatic conflict resolution and synchronization

### Rich Text Editor
- Built with React Quill
- Supports formatting: bold, italic, underline, strikethrough
- Headers, lists, colors, alignment
- Links and images
- Clean HTML output

### User Experience
- Typing indicators show when others are writing
- User presence shows who is currently editing
- Auto-save functionality
- Responsive design for all devices
- Toast notifications for user feedback

### Performance
- Efficient real-time updates
- Optimized database queries
- Minimal network overhead
- Smooth user interface

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Backend Only
```bash
npm run server
```

### Running Frontend Only
```bash
npm run client
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible on the default port (27017)

2. **Port Already in Use**
   - Change the port in the `.env` file
   - Kill processes using the ports 3000 or 5000

3. **Socket.io Connection Issues**
   - Check that the backend server is running
   - Verify CORS settings
   - Check browser console for errors

4. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Document sharing and permissions
- [ ] Version history and revision tracking
- [ ] Comments and annotations
- [ ] Export to different formats (PDF, DOCX)
- [ ] Offline support
- [ ] Mobile app
- [ ] Advanced formatting options
- [ ] Collaborative drawing tools
- [ ] Voice and video chat integration 