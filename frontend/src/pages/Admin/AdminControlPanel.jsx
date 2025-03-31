import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";

const AdminControlPanel = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const [auctions, setAuctions] = useState({});
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const tableStyles = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px"
    };

    const thStyles = {
        padding: "10px",
        border: "1px solid #ddd",
        backgroundColor: "#f2f2f2"
    };

    const tdStyles = {
        padding: "10px",
        border: "1px solid #ddd"
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/all", {
                    withCredentials: true,
                    timeout: 10000
                });
                const usersData = Array.isArray(response.data) ? response.data : [];
                setUsers(usersData);
                setSuccessMessage("Users fetched successfully");
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch users");
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (!users || users.length === 0) return;

        const fetchAuctionsForUsers = async () => {
            try {
                const auctionsByUser = {};
                for (const user of users) {
                    const response = await axios.get(`http://localhost:8080/api/auction-items/user/${user.user_id}`, {
                        withCredentials: true,
                        timeout: 10000
                    });
                    auctionsByUser[user.user_id] = Array.isArray(response.data) ? response.data : [];
                }
                setAuctions(auctionsByUser);
                setSuccessMessage("Auctions fetched successfully");
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch auctions");
            }
        };

        fetchAuctionsForUsers();
    }, [users]);

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This will also delete all their auctions.")) {
            setError("");
            setSuccessMessage("");
            try {
                await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                    withCredentials: true,
                    timeout: 10000
                });
                
                setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
                setAuctions(prevAuctions => {
                    const newAuctions = { ...prevAuctions };
                    delete newAuctions[userId];
                    return newAuctions;
                });
                if (selectedUserId === userId) {
                    setSelectedUserId(null);
                }
                setSuccessMessage("User deleted successfully");
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to delete user");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
                {error && (
                    <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
                        {error}
                        <button 
                            onClick={() => fetchUsers()} 
                            style={{ marginLeft: "10px", padding: "2px 10px" }}
                        >
                            Retry
                        </button>
                    </div>
                )}
                {successMessage && (
                    <div style={{ color: "green", marginBottom: "10px", textAlign: "center" }}>
                        {successMessage}
                    </div>
                )}
                
                <section style={{ marginBottom: "40px" }}>
                    <h2>Users Table</h2>
                    <table style={tableStyles}>
                        <thead>
                            <tr>
                                <th style={thStyles}>User ID</th>
                                <th style={thStyles}>Username</th>
                                <th style={thStyles}>Email</th>
                                <th style={thStyles}>Total Auctions</th>
                                <th style={thStyles}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <tr 
                                        key={user.user_id || Math.random()}
                                        onClick={() => handleUserSelect(user.user_id)}
                                        style={{ 
                                            cursor: "pointer",
                                            ...(selectedUserId === user.user_id && { backgroundColor: "#e6f3ff" })
                                        }}
                                    >
                                        <td style={tdStyles}>{user.user_id}</td>
                                        <td style={tdStyles}>{user.username || 'N/A'}</td>
                                        <td style={tdStyles}>{user.email || 'N/A'}</td>
                                        <td style={tdStyles}>
                                            {(auctions[user.user_id] || []).length}
                                        </td>
                                        <td style={tdStyles}>
                                            <button
                                                style={{ 
                                                    backgroundColor: "#ff4444", 
                                                    color: "white", 
                                                    border: "none", 
                                                    padding: "5px 10px", 
                                                    cursor: "pointer",
                                                    borderRadius: "4px",
                                                    transition: "background-color 0.2s"
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteUser(user.user_id);
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = "#cc0000"}
                                                onMouseOut={(e) => e.target.style.backgroundColor = "#ff4444"}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ ...tdStyles, textAlign: "center" }}>
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>{selectedUserId ? `Auctions for User ${selectedUserId}` : "Select a User to View Auctions"}</h2>
                    {selectedUserId && (
                        <table style={tableStyles}>
                            <thead>
                                <tr>
                                    <th style={thStyles}>Auction ID</th>
                                    <th style={thStyles}>Title</th>
                                    <th style={thStyles}>Status</th>
                                    <th style={thStyles}>Number of Bids</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(auctions[selectedUserId]) && auctions[selectedUserId].length > 0 ? (
                                    auctions[selectedUserId].map((auction) => (
                                        <tr key={auction.auctionItemId || Math.random()}>
                                            <td style={tdStyles}>{auction.auctionItemId}</td>
                                            <td style={tdStyles}>{auction.itemName || 'N/A'}</td>
                                            <td style={tdStyles}>
                                                <span style={{
                                                    color: auction.status === "Active" ? "#28a745" : "#dc3545",
                                                    fontWeight: "bold"
                                                }}>
                                                    {auction.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={tdStyles}>{auction.bidCount || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ ...tdStyles, textAlign: "center" }}>
                                            No auctions found for this user
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminControlPanel;   