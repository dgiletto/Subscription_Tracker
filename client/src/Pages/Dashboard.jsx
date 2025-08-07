import { auth } from "../firebase";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import AddSubscriptionModal from "../Components/AddSubscriptionModal.jsx";
import { Plus } from 'lucide-react';
import "./Dashboard.css";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Sector,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from "recharts";

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
  const [activeIndex, setActiveIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("All");
  const [sortKey, setSortKey] = useState("nextPayment");
  const [sortDirection, setSortDirection] = useState("asc");

  const API_URL = "https://subscription-tracker-qg48.onrender.com/api";

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

  // Fetch subscriptions from Express API
  const fetchSubscriptions = useCallback(async () => {
    if (!auth.currentUser) return;

    const token = await auth.currentUser.getIdToken();
    const res = await fetch(`${API_URL}/auth/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setSubscriptions(data);

    if (data.length > 0) {
      const total = data.length;
      const costs = data.map((s) => parseFloat(s.cost) || 0);
      const average = costs.reduce((a, b) => a + b, 0) / total;
      const monthly = data.reduce((sum, s) => {
        const cost = parseFloat(s.cost) || 0;
        switch (s.billingPeriod?.toLowerCase()) {
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
        (a, b) => parseFloat(a.cost) - parseFloat(b.cost)
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
  }, [API_URL, setSubscriptions, setStats]);

  // Add subscription
  const addSubscription = async () => {
    const token = await auth.currentUser.getIdToken();
    const { name, category, billingPeriod, cost, nextPayment } = formData;
    if (!name || !category || !billingPeriod || !cost || !nextPayment) return;

    await fetch(`${API_URL}/auth/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        category,
        billingPeriod,
        cost: parseFloat(cost),
        nextPayment
      })
    });

    setFormData({
      name: "",
      category: "",
      billingPeriod: "Monthly",
      cost: "",
      nextPayment: "",
    });
    fetchSubscriptions();
  };

  // Delete subscription
  const deleteSubscription = async (id) => {
    const token = await auth.currentUser.getIdToken();
    await fetch(`${API_URL}/auth/subscriptions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchSubscriptions();
  };

  // Edit subscription
  const startEditing = (sub) => {
    setEditingID(sub._id);
    setEditData({
      name: sub.name,
      category: sub.category,
      billingPeriod: sub.billingPeriod,
      cost: sub.cost,
      nextPayment: new Date(sub.nextPayment).toISOString().split("T")[0]
    });
  };

  // Save edits
  const saveEdit = async (id) => {
    const token = await auth.currentUser.getIdToken();
    await fetch(`${API_URL}/auth/subscriptions/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editData)
    });
    setEditingID(null);
    fetchSubscriptions();
  };

  // Chart data
  const categoryData = subscriptions.reduce((acc, sub) => {
    const cat = sub.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value,
  }));

  const costPerCategory = {};
  subscriptions.forEach((sub) => {
    const cat = sub.category || "Uncategorized";
    const rawCost = parseFloat(sub.cost) || 0;
    let monthlyCost = rawCost;
    switch ((sub.billingPeriod || "").toLowerCase()) {
      case "yearly":
        monthlyCost = rawCost / 12;
        break;
      case "weekly":
        monthlyCost = rawCost * 4.33;
        break;
      case "monthly":
      default:
        monthlyCost = rawCost;
    }
    costPerCategory[cat] = (costPerCategory[cat] || 0) + monthlyCost;
  });

  const barChartData = Object.entries(costPerCategory).map(([key, value]) => ({
    category: key,
    cost: parseFloat(value.toFixed(2))
  }));

  // Auth & initial fetch
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else {
        fetchSubscriptions();
      }
    });
    return () => unsub();
  }, [navigate, fetchSubscriptions]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius,
      startAngle, endAngle, fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`${payload.name}: ${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 18} textAnchor={textAnchor} fill="#999">
          {(percent * 100).toFixed(1)}%
        </text>
      </g>
    );
  };

  const filteredSubs = subscriptions
    .filter((sub) => {
      const matchCategory =
        filterCategory === "All" || sub.category === filterCategory;
      const matchPeriod =
        filterPeriod === "All" || sub.billingPeriod === filterPeriod;
      return matchCategory && matchPeriod;
    })
    .sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (sortKey === "cost") {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else if (sortKey === "nextPayment") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = (aVal || "").toString().toLowerCase();
        bVal = (bVal || "").toString().toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button className="Add-Subscription-Btn" onClick={() => setShowModal(true)}>
            <span><Plus size={16} className="plus-icon"/> Add Subscription</span></button>
        </div>

        {stats && (
          <div style={{
            display: "flex", justifyContent: "space-between",
            gap: "10px", marginBottom: "20px", flexWrap: "wrap"
          }}>
            <div className="card">Total Items: <br />{stats.total}</div>
            <div className="card">Avg Cost: <br />${stats.average}</div>
            <div className="card">Avg Monthly: <br />${stats.monthly}</div>
            <div className="card">Most Expensive: <br />{stats.most}</div>
            <div className="card">Least Expensive: <br />{stats.least}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: "20px", marginBottom: "100px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px", height: 300 }}>
            <h4>Cost Per Category Per Month</h4>
            <ResponsiveContainer>
              <BarChart data={barChartData} layout="vertical" margin={{ left: 50 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" />
                <Tooltip />
                <Bar dataKey="cost">
                  {barChartData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1, minWidth: "300px", height: 300 }}>
            <h4>Category Make-up</h4>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={3}
                  labelLine={false}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <h2>Your Subscriptions</h2>

        <div style={{ display: "flex", gap: "15px", marginBottom: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {[...new Set(subscriptions.map((s) => s.category))].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
            <option value="All">All Billing Periods</option>
            {[...new Set(subscriptions.map((s) => s.billingPeriod))].map((period) => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>

          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="name">Name</option>
            <option value="cost">Cost</option>
            <option value="nextPayment">Next Payment</option>
          </select>

          <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="asc">↑ Ascending</option>
            <option value="desc">↓ Descending</option>
          </select>
        </div>

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

        {showModal && (
          <AddSubscriptionModal
            formData={formData}
            setFormData={setFormData}
            addSubscription={addSubscription}
            setShowModal={setShowModal}
          />
        )}

      </div>
    </div>
  );
}
