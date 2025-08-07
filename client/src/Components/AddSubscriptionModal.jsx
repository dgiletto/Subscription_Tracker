import React from 'react';
import './AddSubscriptionModal.css';
import { X, Calendar, DollarSign, Tag, Clock, Plus, ALargeSmall } from 'lucide-react';

export default function AddSubscriptionModal({
    formData,
    setFormData,
    addSubscription,
    setShowModal
}) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          {/* Header */}
          <div className="modal-header">
            <button
              onClick={() => setShowModal(false)}
              className="modal-close-btn"
            >
              <X size={16} />
            </button>
            
            <div className="header-content">
              <div className="header-icon">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="header-title">Add Subscription</h2>
                <p className="header-subtitle">Track your recurring expenses</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="modal-form">
            {/* Service Name */}
            <div className="form-group">
              <label className="form-label">
                <ALargeSmall size={16} className="label-icon" />
                Service Name
              </label>
              <input
                type="text"
                placeholder="Netflix, Spotify, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <Tag size={16} className="label-icon" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="">Select category</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity">Productivity</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="News & Media">News & Media</option>
                <option value="Cloud Storage">Cloud Storage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Cost and Period Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} className="label-icon" />
                  Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="9.99"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} className="label-icon" />
                  Period
                </label>
                <select
                  value={formData.billingPeriod}
                  onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                  className="form-select"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Next Payment */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} className="label-icon" />
                Next Payment Date
              </label>
              <input
                type="date"
                value={formData.nextPayment}
                onChange={(e) => setFormData({ ...formData, nextPayment: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                    addSubscription();
                    setShowModal(false);
                }}
                className="btn btn-primary"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
