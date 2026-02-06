/**
 * Resources Manager Component
 * Admin interface for managing articles/resources with create and edit functionality
 */

import React, { useState, useEffect } from 'react';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../../services/articlesService.firebase';
import ResourceForm from './ResourceForm';
import './ResourcesManager.css';

const ResourcesManager = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch resources on component mount
  useEffect(() => {
    loadResources();
  }, []);

  // Auto-hide success/error messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const data = await getArticles();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
      setErrorMessage('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setEditingResource(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingResource(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      if (editingResource) {
        // Update existing resource
        await updateArticle(editingResource.id, formData);
        setSuccessMessage('Resource updated successfully');
      } else {
        // Create new resource
        await createArticle(formData);
        setSuccessMessage('Resource created successfully');
      }

      // Reload resources
      await loadResources();
      handleFormClose();
    } catch (error) {
      console.error('Error saving resource:', error);
      setErrorMessage('Failed to save resource');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await deleteArticle(resourceId);
        setSuccessMessage('Resource deleted successfully');
        await loadResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        setErrorMessage('Failed to delete resource');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="resources-manager">
      <div className="resources-header">
        <h1>📚 Manage Resources</h1>
        <button className="btn-create-resource" onClick={handleCreateClick} disabled={isLoading}>
          ➕ Create New Resource
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-error">
          ❌ {errorMessage}
        </div>
      )}

      {/* Search Bar */}
      <div className="resources-search">
        <input
          type="text"
          placeholder="Search by title, category, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Resource Form Modal */}
      {isFormOpen && (
        <div className="form-modal-overlay" onClick={handleFormClose}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <ResourceForm
              resource={editingResource}
              onSubmit={handleFormSubmit}
              onClose={handleFormClose}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Resources List */}
      {isLoading && !isFormOpen && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading resources...</p>
        </div>
      )}

      {!isLoading && filteredResources.length === 0 ? (
        <div className="empty-state">
          <p>📭 No resources found</p>
          <button className="btn-create-resource" onClick={handleCreateClick}>
            Create your first resource
          </button>
        </div>
      ) : (
        <div className="resources-grid">
          {filteredResources.map(resource => (
            <div key={resource.id} className="resource-card">
              {resource.imageUrl && (
                <div className="resource-image">
                  <img src={resource.imageUrl} alt={resource.title} />
                  <span className="resource-category">{resource.category}</span>
                </div>
              )}
              
              <div className="resource-content">
                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-author">By {resource.author}</p>
                <p className="resource-description">{resource.description?.substring(0, 100)}...</p>
                
                <div className="resource-meta">
                  <small>{new Date(resource.createdAt).toLocaleDateString()}</small>
                </div>
              </div>

              <div className="resource-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditClick(resource)}
                  disabled={isLoading}
                  title="Edit this resource"
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteClick(resource.id)}
                  disabled={isLoading}
                  title="Delete this resource"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesManager;
