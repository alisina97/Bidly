import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from '../../utils/axiosinstance';

const AdminControlPanel = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userAuctions, setUserAuctions] = useState([]);
    const [deleteError, setDeleteError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalAuctions, setTotalAuctions] = useState(0);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await axiosInstance.get("/api/users/me", { withCredentials: true });

                if (res.data.isAdmin) {
                    setIsAdmin(true);
                } else {
                    navigate("/home");
                }
            } catch (err) {
                console.error("Failed to fetch user details:", err);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [navigate]);

    useEffect(() => {
        if (isAdmin) {
            const fetchUsers = async () => {
                try {
                    const res = await axiosInstance.get("/api/users", { withCredentials: true });
                    setUsers(res.data);
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                }
            };
            fetchUsers();
        }
    }, [isAdmin]);

    const handleUserSelect = async (userId) => {
        setSelectedUserId(userId);
        try {
            const res = await axiosInstance.get(`/api/auction-items/user/${userId}`, { withCredentials: true });
            setUserAuctions(res.data);
            setTotalAuctions(res.data.length); // Update total auctions
        } catch (err) {
            console.error(`Failed to fetch auctions for user ${userId}:`, err);
            setUserAuctions([]);
            setTotalAuctions(0);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axiosInstance.delete(`/api/users/delete/${userId}`, { withCredentials: true });
                setUsers((prev) => prev.filter((user) => user.userId !== userId));
                setDeleteError(null);
                if (selectedUserId === userId) {
                    setSelectedUserId(null);
                    setUserAuctions([]);
                    setTotalAuctions(0);
                }
            } catch (err) {
                console.error("Failed to delete user:", err);
                setDeleteError(`Failed to delete user: ${err.response?.data || err.message}`);
            }
        }
    };

    const handlePromoteToAdmin = async (userId) => {
        if (window.confirm("Are you sure you want to promote this user to admin?")) {
            try {
                await axiosInstance.post(`/api/users/promote/${userId}`, {}, { withCredentials: true });
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.userId === userId ? { ...user, admin: true } : user
                    )
                );
                alert("User promoted to admin successfully!");
            } catch (err) {
                console.error("Failed to promote user:", err);
                alert(`Failed to promote user: ${err.response?.data || err.message}`);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (isAdmin === null) return <p>Checking admin status...</p>;
    if (!isAdmin) return <p>Access denied. You do not have permission to view this page.</p>;

    return (
        <>
            <Navbar />
            <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
                <h2>Admin Control Panel</h2>
                {deleteError && <div style={{ color: "red", marginBottom: "10px" }}>{deleteError}</div>}

                {/* Users Table */}
                <div style={{ marginBottom: "40px" }}>
                    <h3>Users Table</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", border: "1px solid black" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>User ID</th>
                                <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Username</th>
                                <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Email</th>
                                <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Role</th>
                                <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId} onClick={() => handleUserSelect(user.userId)}>
                                    <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{user.userId}</td>
                                    <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{user.username}</td>
                                    <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{user.email}</td>
                                    <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{user.admin ? "Admin" : "User"}</td>
                                    <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                                        <button
                                            style={{ backgroundColor: "#ff4444", color: "white", padding: "5px 10px", marginRight: "5px" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.userId);
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            style={{ backgroundColor: user.admin ? "#ccc" : "#4CAF50", color: "white", padding: "5px 10px" }}
                                            disabled={user.admin}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePromoteToAdmin(user.userId);
                                            }}
                                        >
                                            Promote to Admin
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Auctions Table */}
                {selectedUserId && (
                    <div>
                        <h3>Auctions for User {selectedUserId}</h3>
                        <p><strong>Total Auctions: {totalAuctions}</strong></p>
						<table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", border: "1px solid black" }}>
						    <thead>
						        <tr style={{ backgroundColor: "#f2f2f2", border: "1px solid black" }}>
						            <th style={{ border: "1px solid black", padding: "8px" }}>Auction ID</th>
						            <th style={{ border: "1px solid black", padding: "8px" }}>Item Name</th>
						            <th style={{ border: "1px solid black", padding: "8px" }}>Auction Type</th>
						            <th style={{ border: "1px solid black", padding: "8px" }}>Price (Start → Buy Now)</th>
						        </tr>
						    </thead>
						    <tbody>
						        {userAuctions.length > 0 ? (
						            userAuctions.map((auction) => (
						                <tr key={auction.auctionItemId} style={{ border: "1px solid black" }}>
						                    <td style={{ border: "1px solid black", padding: "8px" }}>{auction.auctionItemId}</td>
						                    <td style={{ border: "1px solid black", padding: "8px" }}>{auction.itemName}</td>
						                    <td style={{ border: "1px solid black", padding: "8px" }}>{auction.auctionType?.auctionTypeName || "N/A"}</td>
						                    <td style={{ border: "1px solid black", padding: "8px" }}>${auction.startingPrice} → ${auction.buyNowPrice}</td>
						                </tr>
						            ))
						        ) : (
						            <tr>
						                <td colSpan="4" style={{ textAlign: "center", border: "1px solid black", padding: "8px" }}>
						                    No auctions found for this user
						                </td>
						            </tr>
						        )}
						    </tbody>
						</table>

                    </div>
                )}
            </div>
        </>
    );
};

export default AdminControlPanel;
