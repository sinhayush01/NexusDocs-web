import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <FileText className="h-8 w-8" />
            <span className="text-xl font-bold">Collaborative Editor</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </Link>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">Real-time Collaboration</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 