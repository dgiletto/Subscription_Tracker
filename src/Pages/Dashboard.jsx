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
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);

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
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubscriptions(data);

        // Compute Summary Stats
        if (data.length > 0) {
            const total = data.length;
            const costs = data.map((s) => parseFloat(s.cost) || 0);

            const average = costs.reduce((a,b) => a + b, 0) / total;

            // Estimate monthly cost
            const monthly = data.reduce((sum, s) => {
                const cost = parseFloat(s.cost) || 0;
                switch(s.billingPeriod?.toLowerCase()) {
                    case "yearly":
                        return sum + cost / 12;
                    case "weekly":
                        return sum + cost * 4.33;
                    case "monthly":
                    default:
                        return sum + cost;
                }
            }, 0);

            const sorted = [...data].sort(
                (a,b) => parseFloat(a.cost) - parseFloat(b.cost)
            );

            setStats({
                total,
                average: average.toFixed(2),
                monthly: monthly.toFixed(2),
                most: sorted[sorted.length - 1]?.name || "N/A",
                least: sorted[0]?.name || "N/A",
            });
        } else {
            setStats(null);
        }
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
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <button className="Add-Subscription-Btn" onClick={() => setShowModal(true)}>+ Add Subscription</button>
            </div>

            {stats && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "20px",
                    flexWrap: "wrap"
                }}
                >
                    <div className="card">Total: <br />{stats.total}</div>
                    <div className="card">Avg Cost: <br />${stats.average}</div>
                    <div className="card">Avg Monthly: <br />${stats.monthly}</div>
                    <div className="card">Most Expensive: <br />{stats.most}</div>
                    <div className="card">Least Expensive: <br />{stats.least}</div>
                </div>
            )}

            <h2>Your Subscriptions</h2>
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
                            <button className="Edit-Btn" onClick={() => startEditing(sub)}>Edit</button>
                            <button className="Delete-Btn" onClick={() => deleteSubscription(sub.id)}>Delete</button>
                            </td>
                        </>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}
                >
                    <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "30px",
                        borderRadius: "10px",
                        width: "400px",
                        position: "relative",
                    }}
                    >
                    <button
                        onClick={() => setShowModal(false)}
                        style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        color: "red",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        }}
                    >
                        ✖
                    </button>
                    <h2 className="header">Add Subscription</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        />
                        <input
                        type="text"
                        placeholder="Category"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        />
                        <input
                        type="number"
                        placeholder="Cost"
                        value={formData.cost}
                        onChange={(e) =>
                            setFormData({ ...formData, cost: e.target.value })
                        }
                        />
                        <div className="flex-row">
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
                            type="date"
                            placeholder="Next Payment"
                            value={formData.nextPayment}
                            onChange={(e) =>
                                setFormData({ ...formData, nextPayment: e.target.value })
                            }
                            />
                        </div>
                        <button className="Modal-Btn"
                        onClick={() => {
                            addSubscription();
                            setShowModal(false);
                        }}
                        >
                        Submit
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}