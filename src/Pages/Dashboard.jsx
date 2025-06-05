import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import "./Dashboard.css";
import {
    collection,
    query,
    where,
    addDoc,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    billingPeriod: "Monthly",
    cost: "",
    nextPayment: "",
  });
  const [editingID, setEditingID] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
    if (!user) {
      navigate("/");
    } else {
      const q = query(
        collection(db, "subscriptions"),
        where("uid", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setSubscriptions(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

      return () => unsubscribe();
    }
  });

  return () => unsub();
}, [navigate]);

// Add a subscription
const addSubscription = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const { name, category, billingPeriod, cost, nextPayment } = formData;
    if (!name || !category || !billingPeriod || !cost || !nextPayment || !user)
      return;

    await addDoc(collection(db, "subscriptions"), {
      uid: auth.currentUser.uid,
      name,
      category,
      billingPeriod,
      cost: parseFloat(cost),
      nextPayment: Timestamp.fromDate(new Date(nextPayment)),
      createdAt: serverTimestamp(),
    });

    setFormData({
      name: "",
      category: "",
      billingPeriod: "Monthly",
      cost: "",
      nextPayment: "",
    });
  };
// Delete a subscription
const deleteSubscription = async (id) => {
    await deleteDoc(doc(db, "subscriptions", id));
};

// Edit a subscription
const startEditing = (sub) => {
    setEditingID(sub.id);
    setEditData({
        name: sub.name,
        category: sub.category,
        billingPeriod: sub.billingPeriod,
        cost: sub.cost,
        nextPayment: sub.nextPayment?.toDate().toISOString().split("T")[0]
    });
};

// Save edits
const saveEdit = async (id) => {
    await updateDoc(doc(db, "subscriptions", id), {
        name: editData.name,
        category: editData.category,
        billingPeriod: editData.billingPeriod,
        cost: parseFloat(editData.cost),
        nextPayment: new Date(editData.nextPayment)
    });
    setEditingID(null);
};

  return (
    <div>
        <Navbar />
        <div className="dashboard-container">
            <div style={{ margin: "20px 0" }}>
                <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                }
                />
                <select
                value={formData.billingPeriod}
                onChange={(e) =>
                    setFormData({ ...formData, billingPeriod: e.target.value })
                }
                >
                <option>Monthly</option>
                <option>Yearly</option>
                <option>Weekly</option>
                </select>
                <input
                type="number"
                placeholder="Cost"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
                <input
                type="date"
                placeholder="Next Payment"
                value={formData.nextPayment}
                onChange={(e) =>
                    setFormData({ ...formData, nextPayment: e.target.value })
                }
                />
                <button onClick={addSubscription}>Add Subscription</button>
            </div>

            <h2>Your Subscriptions</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                        {editingID === sub.id ? (
                        <>
                            <td>
                            <input
                                value={editData.name}
                                onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                                }
                            />
                            </td>
                            <td>
                            <input
                                value={editData.category}
                                onChange={(e) =>
                                setEditData({ ...editData, category: e.target.value })
                                }
                            />
                            </td>
                            <td>
                            <select
                                value={editData.billingPeriod}
                                onChange={(e) =>
                                setEditData({ ...editData, billingPeriod: e.target.value })
                                }
                            >
                                <option>Monthly</option>
                                <option>Yearly</option>
                                <option>Weekly</option>
                            </select>
                            </td>
                            <td>
                            <input
                                type="number"
                                value={editData.cost}
                                onChange={(e) =>
                                setEditData({ ...editData, cost: e.target.value })
                                }
                            />
                            </td>
                            <td>
                            <input
                                type="date"
                                value={editData.nextPayment}
                                onChange={(e) =>
                                setEditData({ ...editData, nextPayment: e.target.value })
                                }
                            />
                            </td>
                            <td>
                            <button onClick={() => saveEdit(sub.id)}>Save</button>
                            <button onClick={() => setEditingID(null)}>Cancel</button>
                            </td>
                        </>
                        ) : (
                        <>
                            <td>{sub.name}</td>
                            <td>{sub.category}</td>
                            <td>{sub.billingPeriod}</td>
                            <td>{sub.cost}</td>
                            <td>{sub.nextPayment?.toDate().toLocaleDateString()}</td>
                            <td>
                            <button onClick={() => startEditing(sub)}>Edit</button>
                            <button onClick={() => deleteSubscription(sub.id)}>Delete</button>
                            </td>
                        </>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}