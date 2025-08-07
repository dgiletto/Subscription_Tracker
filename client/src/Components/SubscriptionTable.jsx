import React from "react";
import './SubscriptionTable.css';

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
    return (
        <table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Billing Period</th>
                <th>Cost ($)</th>
                <th>Next Payment</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredSubs.map((sub) => (
                <tr key={sub._id}>
                    {editingID === sub._id ? (
                    <>
                        <td><input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></td>
                        <td><input value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} /></td>
                        <td>
                        <select value={editData.billingPeriod} onChange={(e) => setEditData({ ...editData, billingPeriod: e.target.value })}>
                            <option>Monthly</option>
                            <option>Yearly</option>
                            <option>Weekly</option>
                        </select>
                        </td>
                        <td><input type="number" value={editData.cost} onChange={(e) => setEditData({ ...editData, cost: e.target.value })} /></td>
                        <td><input type="date" value={editData.nextPayment} onChange={(e) => setEditData({ ...editData, nextPayment: e.target.value })} /></td>
                        <td>
                        <button onClick={() => saveEdit(sub._id)}>Save</button>
                        <button onClick={() => setEditingID(null)}>Cancel</button>
                        </td>
                    </>
                    ) : (
                    <>
                        <td>{sub.name}</td>
                        <td>{sub.category}</td>
                        <td>{sub.billingPeriod}</td>
                        <td>{sub.cost}</td>
                        <td>{new Date(sub.nextPayment).toLocaleDateString()}</td>
                        <td>
                        <button className="Edit-Btn" onClick={() => startEditing(sub)}>Edit</button>
                        <button className="Delete-Btn" onClick={() => deleteSubscription(sub._id)}>Delete</button>
                        </td>
                    </>
                    )}
                </tr>
                ))}
            </tbody>
        </table>
    );
}