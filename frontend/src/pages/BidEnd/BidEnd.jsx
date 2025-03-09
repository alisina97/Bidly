import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BidEnd = () => {
    const navigate = useNavigate();

    const [winner, setWinner] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [auctionItem, setAuctionItem] = useState(null);
    const [isUserWinner, setIsUserWinner] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [expeditedShipping, setExpeditedShipping] = useState(false);

    const userId = 1;
    const auctionItemId = 1;

    useEffect(() => {
        fetch(`/api/winners/${auctionItemId}`)
            .then(res => res.json())
            .then(data => {
                setWinner(data);
                fetch(`/api/user-details/details/${data.user.userId}`)
                    .then(res => res.json())
                    .then(setUserDetails);
            })
            .catch(err => setErrorMessage(err.message));

        fetch(`/api/auction-items/${auctionItemId}`)
            .then(res => res.json())
            .then(setAuctionItem)
            .catch(err => setErrorMessage(err.message));

        fetch(`/api/winners/is-winner?userId=${userId}&auctionItemId=${auctionItemId}`)
            .then(res => res.json())
            .then(setIsUserWinner)
            .catch(() => setErrorMessage("Failed to verify winner status."));
    }, []);

    if (!winner || !userDetails || !auctionItem) {
        return <p>Loading winner details...</p>;
    }

    const handlePaymentRedirect = () => {
        if (isUserWinner) {
            navigate("/payment", {
                state: {
                    winner,
                    auctionItem,
                    userDetails,
                    expeditedShipping
                }
            });
        } else {
            setErrorMessage("Unauthorized: You are not the winner.");
        }
    };

    return (
        <div className="bid-end-container">
            <h1>Auction Ended</h1>
            {isUserWinner ? (
                <>
                    <p>
                        Congratulations {userDetails.firstName} {userDetails.lastName}, you won the auction!
                    </p>
                    <div className="payment-section">
                        <h2>Order Summary</h2>
                        <p><strong>Item Name:</strong> {auctionItem.itemName}</p>
                        <p><strong>Description:</strong> {auctionItem.itemDescription}</p>
                        <p><strong>Final Price:</strong> ${winner.winningPrice}</p>
                        <p>Standard Shipping: $10</p>

                        <label>
                            <input
                                type="checkbox"
                                checked={expeditedShipping}
                                onChange={() => setExpeditedShipping(!expeditedShipping)}
                            />
                            Add Expedited Shipping (+$20)
                        </label>

                        <h3>
                            Total: ${winner.winningPrice + 10 + (expeditedShipping ? 20 : 0)}
                        </h3>

                        <button onClick={handlePaymentRedirect}>Pay Now</button>
                    </div>
                </>
            ) : (
                <p className="error-message">
                    {errorMessage || "Sorry, you did not win this auction."}
                </p>
            )}
        </div>
    );
};

export default BidEnd;
