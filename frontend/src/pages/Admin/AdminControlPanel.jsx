import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";

const AdminControlPanel = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Sample users data
    const [users, setUsers] = useState([
        { id: 1, username: "john_doe", email: "john@example.com", totalAuctions: 5 },
        { id: 2, username: "jane_smith", email: "jane@example.com", totalAuctions: 3 },
    ]);

    // Sample auctions data
    const auctions = {
        1: [
            { auctionId: "A001", title: "Vintage Watch", status: "Active", bids: 12 },
            { auctionId: "A002", title: "Antique Lamp", status: "Ended", bids: 8 },
        ],
        2: [
            { auctionId: "A003", title: "Rare Book", status: "Active", bids: 5 },
        ],
    };

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(user => user.id !== userId));
            if (selectedUserId === userId) {
                setSelectedUserId(null);
            }
        }
    };

    return (
        <>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            {/* Users Table */}
            <div style={{ marginBottom: "40px" }}>
                <h2>Users Table</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Auctions</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr 
                                key={user.id}
                                onClick={() => handleUserSelect(user.id)}
                                style={{ 
                                    cursor: "pointer",
                                    ...(selectedUserId === user.id && { backgroundColor: "#e6f3ff" })
                                }}
                            >
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.id}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.username}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.email}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalAuctions}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                    <button
                                        style={{ 
                                            backgroundColor: "#ff4444", 
                                            color: "white", 
                                            border: "none", 
                                            padding: "5px 10px", 
                                            cursor: "pointer" 
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Selected User's Auctions */}
            <div>
                <h2>{selectedUserId ? `Auctions for User ${selectedUserId}` : "Select a User to View Auctions"}</h2>
                {selectedUserId && (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Auction ID</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Title</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Number of Bids</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(auctions[selectedUserId] || []).map((auction) => (
                                <tr key={auction.auctionId}>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{auction.auctionId}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{auction.title}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{auction.status}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{auction.bids}</td>
                                </tr>
                            ))}
                            {(!auctions[selectedUserId] || auctions[selectedUserId].length === 0) && (
                                <tr>
                                    <td 
                                        colSpan="4" 
                                        style={{ 
                                            padding: "10px", 
                                            border: "1px solid #ddd", 
                                            textAlign: "center" 
                                        }}
                                    >
                                        No auctions found for this user
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </>
    );
};

export default AdminControlPanel;