import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BidEnd = () => {
    const navigate = useNavigate();
    const loggedInUserId = 1; // Logged-in user ID

    const [winner, setWinner] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [auctionItem, setAuctionItem] = useState(null);
    const [expeditedShipping, setExpeditedShipping] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/winners/1")
            .then(res => res.json())
            .then(data => {
                setWinner(data);
                return Promise.all([
                    fetch(`http://localhost:8080/api/user-details/details/${data.user.userId}`).then(res => res.json()),
                    fetch(`http://localhost:8080/api/auction-items/${data.auctionItem.auctionItemId}`).then(res => res.json())
                ]);
            })
            .then(([userDetails, auctionItem]) => {
                setUserDetails(userDetails);
                setAuctionItem(auctionItem);
            })
            .catch(() => setErrorMessage("Failed to load auction details."));
    }, []);

    const handlePaymentRedirect = () => {
        const totalAmount = winner.winningPrice + 10 + (expeditedShipping ? 20 : 0);

        navigate("/payment", {
            state: {
                userId: loggedInUserId,
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
    if (!winner || !userDetails || !auctionItem) return <p>Loading...</p>;

    // Check if the logged-in user is the winner
    const isUserWinner = loggedInUserId === winner.user.userId;

    return (
        <div className="bid-end-container">
            <h1>Auction Ended</h1>
            <p>Winner: {userDetails.firstName} {userDetails.lastName} (Username: {winner.user.username})</p>

            {isUserWinner ? (
                <p className="winner-message">You are the winner! Proceed to payment.</p>
            ) : (
                <p className="error-message"> You did not win this auction.</p>
            )}

            <div className="payment-section">
                <h2>Order Summary</h2>
                <p><strong>Item Name:</strong> {auctionItem.itemName}</p>
                <p><strong>Description:</strong> {auctionItem.itemDescription}</p>
                <p><strong>Final Price:</strong> ${winner.winningPrice}</p>
                <p>Standard Shipping: $10</p>

                <label>
                    <input type="checkbox" checked={expeditedShipping} onChange={() => setExpeditedShipping(!expeditedShipping)} />
                    Add Expedited Shipping (+$20)
                </label>

                <h3>Total: ${winner.winningPrice + 10 + (expeditedShipping ? 20 : 0)}</h3>

                <button onClick={handlePaymentRedirect} disabled={!isUserWinner}>Pay Now</button>
            </div>
        </div>
    );
};

export default BidEnd;
