const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative-editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Document Schema
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  collaborators: [{ type: String }]
});

const Document = mongoose.model('Document', documentSchema);

// Socket.io connection handling
const connectedUsers = new Map();
const documentSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join document room
  socket.on('join-document', async (documentId) => {
    socket.join(documentId);
    
    // Add user to document session
    if (!documentSessions.has(documentId)) {
      documentSessions.set(documentId, new Set());
    }
    documentSessions.get(documentId).add(socket.id);
    
    // Get document content
    try {
      const document = await Document.findById(documentId);
      if (document) {
        socket.emit('document-content', document.content);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
    
    // Notify other users
    socket.to(documentId).emit('user-joined', socket.id);
  });

  // Handle text changes
  socket.on('text-change', async (data) => {
    const { documentId, content, userId } = data;
    
    // Broadcast to other users in the same document
    socket.to(documentId).emit('text-update', {
      content,
      userId,
      timestamp: Date.now()
    });
    
    // Save to database
    try {
      await Document.findByIdAndUpdate(documentId, {
        content,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error saving document:', error);
    }
  });

  // Handle cursor position
  socket.on('cursor-move', (data) => {
    const { documentId, position, userId } = data;
    socket.to(documentId).emit('cursor-update', {
      userId,
      position,
      timestamp: Date.now()
    });
  });

  // Handle user typing
  socket.on('typing', (data) => {
    const { documentId, isTyping, userId } = data;
    socket.to(documentId).emit('user-typing', {
      userId,
      isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from all document sessions
    for (const [documentId, users] of documentSessions.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        socket.to(documentId).emit('user-left', socket.id);
      }
    }
    
    connectedUsers.delete(socket.id);
  });
});

// REST API Routes
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ updatedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { title } = req.body;
    const document = new Document({ title });
    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document' });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 