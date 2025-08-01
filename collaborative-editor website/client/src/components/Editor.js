import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, Save, Eye } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const socketRef = useRef();
  const quillRef = useRef();
  const typingTimeoutRef = useRef();

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'align',
    'link', 'image'
  ];

  useEffect(() => {
    fetchDocument();
    setupSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/documents/${id}`);
      setDocument(response.data);
      setContent(response.data.content || '');
      setTitle(response.data.title || '');
    } catch (error) {
      toast.error('Failed to fetch document');
      console.error('Error fetching document:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current.emit('join-document', id);
    });

    socketRef.current.on('document-content', (content) => {
      setContent(content);
    });

    socketRef.current.on('text-update', (data) => {
      if (data.userId !== socketRef.current.id) {
        setContent(data.content);
      }
    });

    socketRef.current.on('user-joined', (userId) => {
      setConnectedUsers(prev => [...prev, { id: userId, name: `User ${userId.slice(-4)}` }]);
      toast.success('Someone joined the document');
    });

    socketRef.current.on('user-left', (userId) => {
      setConnectedUsers(prev => prev.filter(user => user.id !== userId));
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      toast('Someone left the document', { icon: '👋' });
    });

    socketRef.current.on('user-typing', (data) => {
      if (data.userId !== socketRef.current.id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  };

  const handleContentChange = (newContent, delta, source, editor) => {
    if (source === 'user') {
      setContent(newContent);
      
      // Emit typing status
      setIsTyping(true);
      socketRef.current.emit('typing', {
        documentId: id,
        isTyping: true,
        userId: socketRef.current.id
      });

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set typing timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socketRef.current.emit('typing', {
          documentId: id,
          isTyping: false,
          userId: socketRef.current.id
        });
      }, 1000);

      // Emit text change
      socketRef.current.emit('text-change', {
        documentId: id,
        content: newContent,
        userId: socketRef.current.id
      });
    }
  };

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    try {
      await axios.put(`/api/documents/${id}`, {
        title: newTitle,
        content: content
      });
    } catch (error) {
      toast.error('Failed to update title');
      console.error('Error updating title:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/documents/${id}`, {
        title: title,
        content: content
      });
      toast.success('Document saved successfully!');
    } catch (error) {
      toast.error('Failed to save document');
      console.error('Error saving document:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Documents</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{connectedUsers.length + 1} online</span>
            </div>
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
        
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0"
          placeholder="Untitled Document"
        />
        
        {/* Connected users */}
        {connectedUsers.length > 0 && (
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-gray-600">Collaborators:</span>
            {connectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Typing indicators */}
        {typingUsers.size > 0 && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500 italic">
              {Array.from(typingUsers).map((userId, index) => {
                const user = connectedUsers.find(u => u.id === userId);
                return user ? user.name : `User ${userId.slice(-4)}`;
              }).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing your document..."
          className="min-h-[500px]"
        />
      </div>

      {/* Status bar */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Characters: {content.replace(/<[^>]*>/g, '').length}</span>
          <span>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>Real-time collaboration enabled</span>
        </div>
      </div>
    </div>
  );
};

export default Editor; 