import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (e) => {
    e.preventDefault();
    if (!newDocumentTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    try {
      const response = await axios.post('/api/documents', {
        title: newDocumentTitle.trim()
      });
      
      setDocuments([response.data, ...documents]);
      setNewDocumentTitle('');
      setShowCreateForm(false);
      toast.success('Document created successfully!');
    } catch (error) {
      toast.error('Failed to create document');
      console.error('Error creating document:', error);
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments(documents.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete document');
      console.error('Error deleting document:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Document</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <form onSubmit={createDocument} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                id="title"
                value={newDocumentTitle}
                onChange={(e) => setNewDocumentTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter document title..."
                autoFocus
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Create Document
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewDocumentTitle('');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-6">Create your first document to get started with collaborative editing.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Document
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <div
              key={document._id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    to={`/document/${document._id}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {document.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(document.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {formatDate(document.updatedAt)}</span>
                    </div>
                  </div>
                  
                  {document.content && (
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {document.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/document/${document._id}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDocument(document._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList; 