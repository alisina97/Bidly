import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from '../../utils/axiosinstance';

const AdminControlPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userAuctions, setUserAuctions] = useState([]);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get("/api/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };
        fetchUsers();
    }, []);

    // 📥 Fetch auctions for selected user
    const handleUserSelect = async (userId) => {
        setSelectedUserId(userId);
        try {
            const res = await axiosInstance.get(`/api/auction-items/user/${userId}`);
            setUserAuctions(res.data);
        } catch (err) {
            console.error(`Failed to fetch auctions for user ${userId}:`, err);
            setUserAuctions([]);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axiosInstance.delete(`/api/users/delete/${userId}`);
                setUsers((prev) => prev.filter((user) => user.userId !== userId));
                setDeleteError(null); 
                if (selectedUserId === userId) {
                    setSelectedUserId(null);
                    setUserAuctions([]);
                }
            } catch (err) {
                console.error("Failed to delete user:", err);
                setDeleteError(`Failed to delete user: ${err.response?.data || err.message}`);
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
                    {deleteError && (
                        <div style={{ color: "red", marginBottom: "10px" }}>
                            {deleteError}
                        </div>
                    )}
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
                                    key={user.userId}
                                    onClick={() => handleUserSelect(user.userId)}
                                    style={{
                                        cursor: "pointer",
                                        ...(selectedUserId === user.userId && { backgroundColor: "#e6f3ff" }),
                                    }}
                                >
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.userId}</td>
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
                                                cursor: "pointer",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.userId);
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

                {/* Auctions Table */}
                <div>
                    <h2>{selectedUserId ? `Auctions for User ${selectedUserId}` : "Select a User to View Auctions"}</h2>
                    {selectedUserId && (
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Auction ID</th>
                                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Item Name</th>
                                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Auction Type</th>
                                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price (Start → Buy Now)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAuctions.length > 0 ? (
                                    userAuctions.map((auction) => (
                                        <tr key={auction.auctionItemId}>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{auction.auctionItemId}</td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{auction.itemName}</td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {auction.auctionType?.auctionTypeName || "N/A"}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                ${auction.startingPrice} → ${auction.buyNowPrice}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
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