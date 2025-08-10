import React from "react";
import './SubscriptionTable.css';
import { Edit2, Trash2, Check, X, Calendar, DollarSign, Tag } from 'lucide-react';

export default function SubscriptionTable({
    filteredSubs,
    editingID,
    setEditingID,
    editData,
    setEditData,
    saveEdit,
    startEditing,
    deleteSubscription
}) {

    const getCategoryIcon = (category) => {
        switch (category) {
        case 'Entertainment':
            return '🎬';
        case 'Productivity':
            return '💼';
        case 'Health & Fitness':
            return '💪';
        case 'News & Media':
            return '📰';
        case 'Cloud Storage':
            return '☁️';
        default:
            return '📱';
        }
    };

    const getBillingPeriodColor = (period) => {
        switch (period) {
        case 'Weekly':
            return '#10b981'; // green
        case 'Monthly':
            return '#3b82f6'; // blue
        case 'Yearly':
            return '#8b5cf6'; // purple
        default:
            return '#6b7280'; // gray
        }
    };

    return (
      <div className="table-container">
        <table className="subscription-table">
          <thead className="table-header">
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Billing Period</th>
              <th>Cost</th>
              <th>Next Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredSubs.map((sub) => (
              <tr 
                key={sub._id} 
                className={editingID === sub._id ? 'editing-row' : ''}
              >
                {editingID === sub._id ? (
                  <>
                    <td className="table-cell">
                      <input 
                        className="edit-input"
                        value={editData.name} 
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })} 
                      />
                    </td>
                    <td className="table-cell">
                      <input 
                        className="edit-input"
                        value={editData.category} 
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })} 
                      />
                    </td>
                    <td className="table-cell">
                      <select 
                        className="edit-select"
                        value={editData.billingPeriod} 
                        onChange={(e) => setEditData({ ...editData, billingPeriod: e.target.value })}
                      >
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </td>
                    <td className="table-cell">
                      <input 
                        className="edit-input"
                        type="number" 
                        step="0.01"
                        value={editData.cost} 
                        onChange={(e) => setEditData({ ...editData, cost: e.target.value })} 
                      />
                    </td>
                    <td className="table-cell">
                      <input 
                        className="edit-input"
                        type="date" 
                        value={editData.nextPayment} 
                        onChange={(e) => setEditData({ ...editData, nextPayment: e.target.value })} 
                      />
                    </td>
                    <td className="table-cell">
                      <div className="actions-cell">
                        <button className="action-btn save-btn" onClick={() => saveEdit(sub._id)}>
                          <Check size={14} />
                          Save
                        </button>
                        <button className="action-btn cancel-btn" onClick={() => setEditingID(null)}>
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="table-cell">
                      <div className="service-name">
                        <div className="service-icon">
                          {getCategoryIcon(sub.category)}
                        </div>
                        <span>{sub.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="category-tag">
                        <Tag size={12} />
                        {sub.category}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span 
                        className="billing-period"
                        style={{ backgroundColor: getBillingPeriodColor(sub.billingPeriod) }}
                      >
                        {sub.billingPeriod}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="cost-display">
                        <DollarSign size={16} />
                        {sub.cost}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div 
                        className="next-payment"
                        style={{
                          color: (new Date(sub.nextPayment) - new Date()) / (1000 * 60 * 60 * 24) <= 7 ? "red" : "inherit"
                        }}>
                        <Calendar size={14} />
                        {new Date(sub.nextPayment).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => startEditing(sub)}>
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button className="action-btn delete-btn" onClick={() => deleteSubscription(sub._id)}>
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}