import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";

const UserDash = () => {
  // We'll store user info in separate states:
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // "Auctions Won" data (i.e., Winner records)
  const [auctionsWonData, setAuctionsWonData] = useState([]);

  // "Current Bids" data (i.e., Bids the user has placed)
  const [currentBidsData, setCurrentBidsData] = useState([]);

  // 1) Fetch current user's ID from /api/users/me, then fetch full user data
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // First call: get the user_id from session
        const meRes = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true,
        });
        const foundUserId = meRes.data.user_id;
        setLoggedInUserId(foundUserId);

        // Second call: get the full user info by ID
        const userRes = await axios.get(
          `http://localhost:8080/api/users/${foundUserId}`,
          { withCredentials: true }
        );
        if (userRes.data.username) setUsername(userRes.data.username);
        if (userRes.data.email) setEmail(userRes.data.email);
      } catch (err) {
        console.error("Failed to load user info:", err);
        setError("User session not found. Please log in.");
      }
    };

    fetchUserInfo();
  }, []);

  // 2) Once we have the userId, fetch "winners" (Auctions Won)
  useEffect(() => {
    if (!loggedInUserId) return;

    axios
      .get(`http://localhost:8080/api/winners/by-user/${loggedInUserId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const transformedData = res.data.map((winner) => {
          const item = winner.auctionItem || {};
          return {
            winnerId: winner.winnerId,
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            auctionTypeName: item.auctionType?.auctionTypeName,
            categoryName: item.category?.categoryName,
            winningPrice: winner.winningPrice,
            paidFor: winner.paidFor ? "Paid" : "Unpaid",
            dateWon: "(no date stored)", // If you have a real date, you can store & sort similarly
          };
        });
        // If you have a real "dateWon" you could sort by newest first. Right now it's a placeholder.
        setAuctionsWonData(transformedData);
      })
      .catch((err) => {
        console.error("Error fetching winners for user:", err);
        setError("Failed to fetch auctions won for this user.");
      });
  }, [loggedInUserId]);

  // 3) Fetch "bids" for the user to show in Current Bids table
  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchBidsAndStatuses = async () => {
      try {
        const bidsResponse = await axios.get(
          `http://localhost:8080/api/bids/user/${loggedInUserId}`,
          { withCredentials: true }
        );

        let transformedBids = await Promise.all(
          bidsResponse.data.map(async (bid) => {
            const item = bid.auctionItem || {};

            // We'll keep the raw datetime for sorting
            const rawDateString = bid.bidTime;

            // Format bidTime for display
            let friendlyTime = rawDateString;
            try {
              const dateObj = new Date(rawDateString);
              friendlyTime = dateObj.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch (err) {
              console.error("Invalid date format:", bid.bidTime);
            }

            // Fetch AuctionStatus for currentPrice, itemStatus
            let currentPrice = null;
            let itemStatus = "";
            if (item.auctionItemId) {
              try {
                const statusRes = await axios.get(
                  `http://localhost:8080/api/auction-status/${item.auctionItemId}`,
                  { withCredentials: true }
                );
                currentPrice = statusRes.data.currentPrice;
                // Translate "SOLD"/"NOT_SOLD" to friendlier text
                if (statusRes.data.itemStatus === "SOLD") {
                  itemStatus = "Sold";
                } else if (statusRes.data.itemStatus === "NOT_SOLD") {
                  itemStatus = "Not Sold";
                } else {
                  itemStatus = statusRes.data.itemStatus || "N/A";
                }
              } catch (err) {
                console.error("Error fetching auction status", err);
              }
            }

            return {
              // Keep a raw date (for sorting newest first)
              rawBidTime: rawDateString,

              // Original fields
              itemName: item.itemName,
              itemDescription: item.itemDescription,
              startingPrice: item.startingPrice,
              buyNowPrice: item.buyNowPrice,
              bidAmount: bid.bidAmount,
              bidTime: friendlyTime,
              categoryName: item.category?.categoryName,
              auctionTypeName: item.auctionType?.auctionTypeName,

              // New fields
              currentPrice,
              itemStatus,
            };
          })
        );

        // Sort newest first by rawBidTime
        transformedBids.sort((a, b) => {
          const dateA = new Date(a.rawBidTime);
          const dateB = new Date(b.rawBidTime);
          return dateB - dateA; // Descending
        });

        setCurrentBidsData(transformedBids);
      } catch (err) {
        console.error("Error fetching bids for user:", err);
        setError("Failed to fetch bids for this user.");
      }
    };

    fetchBidsAndStatuses();
  }, [loggedInUserId]);

  // Simple styles
  const boxStyle = {
    marginBottom: "20px",
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    textAlign: "left",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  };

  const tableStyle = {
    width: "100%",
    minWidth: "900px", // Adjust as needed
    borderCollapse: "collapse",
  };

  const headerCellStyle = {
    borderBottom: "2px solid #ccc",
    padding: "10px",
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const cellStyle = {
    borderBottom: "1px solid #ccc",
    padding: "8px",
    verticalAlign: "middle",
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <h2 style={{ marginBottom: "25px" }}>User Dashboard</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Show user info if available */}
        {!error && (username || email) && (
          <p>
            Welcome, <strong>{username}</strong> <br />
            <em>{email}</em>
          </p>
        )}

        {/* Current Bids Table */}
        <div style={boxStyle}>
          <h3 style={{ marginTop: 0 }}>Current Bids</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Item Name</th>
                <th style={headerCellStyle}>Description</th>
                {/* Numeric fields grouped next */}
                <th style={headerCellStyle}>Starting Price</th>
                <th style={headerCellStyle}>Buy Now Price</th>
                <th style={headerCellStyle}>Your Bid</th>
                <th style={headerCellStyle}>Current Price</th>
                {/* Then remaining fields */}
                <th style={headerCellStyle}>Bid Time</th>
                <th style={headerCellStyle}>Item Status</th>
                <th style={headerCellStyle}>Category</th>
                <th style={headerCellStyle}>Auction Type</th>
              </tr>
            </thead>
            <tbody>
              {currentBidsData.map((row, idx) => (
                <tr key={idx}>
                  <td style={cellStyle}>{row.itemName}</td>
                  <td style={cellStyle}>{row.itemDescription}</td>
                  {/* Numeric fields */}
                  <td style={cellStyle}>${row.startingPrice}</td>
                  <td style={cellStyle}>${row.buyNowPrice}</td>
                  <td style={cellStyle}>${row.bidAmount}</td>
                  <td style={cellStyle}>
                    {row.currentPrice !== null ? `$${row.currentPrice}` : "N/A"}
                  </td>
                  {/* Remaining fields */}
                  <td style={cellStyle}>{row.bidTime}</td>
                  <td style={cellStyle}>{row.itemStatus}</td>
                  <td style={cellStyle}>{row.categoryName}</td>
                  <td style={cellStyle}>{row.auctionTypeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Auctions Won Table */}
        <div style={boxStyle}>
          <h3 style={{ marginTop: 0 }}>Auctions Won</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Item Name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Auction Type</th>
                <th style={headerCellStyle}>Category</th>
                <th style={headerCellStyle}>Winning Price</th>
                <th style={headerCellStyle}>Purchase Status</th>
              </tr>
            </thead>
            <tbody>
              {auctionsWonData.map((row, idx) => (
                <tr key={idx}>
                  <td style={cellStyle}>{row.itemName}</td>
                  <td style={cellStyle}>{row.itemDescription}</td>
                  <td style={cellStyle}>{row.auctionTypeName}</td>
                  <td style={cellStyle}>{row.categoryName}</td>
                  <td style={cellStyle}>${row.winningPrice}</td>
                  <td style={cellStyle}>{row.paidFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserDash;
