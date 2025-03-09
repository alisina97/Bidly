import React, { useState, useEffect } from "react";

const BidEnd = ({ auctionItemId, userId }) => {
    const [winner, setWinner] = useState(null);
    const [isUserWinner, setIsUserWinner] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [expeditedShipping, setExpeditedShipping] = useState(false);

    useEffect(() => {
        if (!auctionItemId || !userId) return;

        // Fetch winner details
        fetch(`/api/winners/${auctionItemId}`)
            .then((res) => res.json())
            .then((data) => setWinner(data))
            .catch(() => setErrorMessage("Failed to fetch winner details."));

        // Check if current user is the winner
        fetch(`/api/winners/is-winner?userId=${userId}&auctionItemId=${auctionItemId}`)
            .then((res) => res.json())
            .then((isWinner) => setIsUserWinner(isWinner))
            .catch(() => setErrorMessage("Failed to verify winner status."));
    }, [auctionItemId, userId]);

    if (!winner) {
        return <p>Loading winner details...</p>;
    }

    return (
        <div className="bid-end-container">
            <h1>Auction Ended</h1>
            {isUserWinner ? (
                <>
                    <p>Congratulations! You won the auction.</p>

                    <div className="payment-section">
                        <h2>Order Summary</h2>
                        <p>Item: {winner.auctionItem.itemName}</p>
                        <p>Final Price: ${winner.winningPrice}</p>
                        <p>Standard Shipping: $10</p> {/* Example shipping price */}

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

                        <button>Pay Now</button>
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
