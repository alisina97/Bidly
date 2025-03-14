import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar/Navbar'


const BidEnd = () => {
    const navigate = useNavigate();
    
    const [loggedInUserId, setLoggedInUserId] = useState(null); // Store user ID from session
    const [winner, setWinner] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [auctionItem, setAuctionItem] = useState(null);
    const [expeditedShipping, setExpeditedShipping] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ Fetch logged-in user ID from session on component mount
    useEffect(() => {
        fetch("http://localhost:8080/api/users/me", { credentials: "include" }) // Ensure session-based auth
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user session.");
                return res.json();
            })
            .then(data => {
                setLoggedInUserId(data.userId); // ✅ Set logged-in user ID
            })
            .catch(() => setErrorMessage("User session not found. Please log in."));
    }, []);

    useEffect(() => {
        if (!loggedInUserId) return; // Wait until we have user ID

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
    }, [loggedInUserId]); // ✅ Depend on loggedInUserId

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

    // catches error messages to return a visual error message 
    if (errorMessage) return <p className="error-message">{errorMessage}</p>;
    
    // 
    if (!winner || !userDetails || !auctionItem || !loggedInUserId) return <p>Loading...</p>;

    // ✅ Check if logged-in user is the winner
    const isUserWinner = loggedInUserId === winner.user.userId;

    return (
            // tracks the winner of the of the auction after getting the winner of the auction for the payment page
        <div className="bid-end-container">
         <Navbar />  
            
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
