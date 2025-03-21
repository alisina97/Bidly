import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./BidEnd.css";

const BidEnd = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const auctionItemId = location.state?.auctionItemId;

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [auctionItem, setAuctionItem] = useState(null);
  const [expeditedShipping, setExpeditedShipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auctionItemId) {
      setErrorMessage("Auction ID missing.");
      return;
    }

    // Get logged in user
    fetch("http://localhost:8080/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setLoggedInUserId(data.userId || data.user_id))
      .catch(() => setErrorMessage("User session not found."));

    // Get winner
    fetch(`http://localhost:8080/api/winners/${auctionItemId}`)
      .then(res => res.json())
      .then(winnerData => {
        setWinner(winnerData);
        return Promise.all([
          fetch(`http://localhost:8080/api/user-details/details/${winnerData.user.userId}`).then(res => res.json()),
          fetch(`http://localhost:8080/api/auction-items/${auctionItemId}`).then(res => res.json())
        ]);
      })
      .then(([fetchedUserDetails, fetchedAuctionItem]) => {
        setUserDetails(fetchedUserDetails);
        setAuctionItem(fetchedAuctionItem);
      })
      .catch(() => setErrorMessage("Failed to load auction or winner details."));
  }, [auctionItemId]);

  const handlePaymentRedirect = () => {
    const totalAmount = winner.winningPrice + 10 + (expeditedShipping ? 20 : 0);

    navigate("/payment", {
      state: {
        auctionItemId: winner.auctionItem.auctionItemId,
        winner,
        auctionItem,
        userDetails,
        expeditedShipping,
        totalAmount
      }
    });
  };

  if (errorMessage) return <p className="error-message">{errorMessage}</p>;
  if (!winner || !userDetails || !auctionItem || !loggedInUserId) return <p className="loading-text">Loading...</p>;

  const isUserWinner = loggedInUserId === winner.user.userId;

  return (
    <div className="bid-end-container">
      <Navbar />

      <div className="card">
        <h1 className="title">Auction Ended</h1>
        <p className="winner-info">
          Winner: <strong>{userDetails.firstName} {userDetails.lastName}</strong> (Username: <em>{winner.user.username}</em>)
        </p>

        {isUserWinner ? (
          <p className="winner-message">🎉 You are the winner! Proceed to payment.</p>
        ) : (
          <p className="error-message">You did not win this auction.</p>
        )}

        <div className="payment-section">
          <h2>Order Summary</h2>
          <p><strong>Item Name:</strong> {auctionItem.itemName}</p>
          <p><strong>Description:</strong> {auctionItem.itemDescription}</p>
          <p><strong>Final Price:</strong> ${winner.winningPrice}</p>
          <p>Standard Shipping: $10</p>

          <label className="shipping-option">
            <input
              type="checkbox"
              checked={expeditedShipping}
              onChange={() => setExpeditedShipping(!expeditedShipping)}
            />
            Add Expedited Shipping (+$20)
          </label>

          <h3>Total: ${winner.winningPrice + 10 + (expeditedShipping ? 20 : 0)}</h3>

          <button className="pay-button" onClick={handlePaymentRedirect} disabled={!isUserWinner}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidEnd;
