import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OiledDutchOven = () => {
  const navigate = useNavigate();
  const loggedInUserId = 1;
  const auctionItemId = 1;
  const [auctionItem, setAuctionItem] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [newBid, setNewBid] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAuction = () => {
      fetch(`http://localhost:8080/api/auction-items/${auctionItemId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Fetch failed");
          return res.json();
        })
        .then((data) => {
          setAuctionItem(data);
          setHighestBid(data.highestBid || 0);
          setHighestBidder(data.highestBidder || "No bids yet");
          setAuctionEnded(data.auctionEnded || false);
        })
        .catch(() => setErrorMessage("Failed to load auction data"));
    };

    fetchAuction();
    const interval = setInterval(fetchAuction, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBid = () => {
    const bidAmount = parseFloat(newBid);
    if (isNaN(bidAmount) || bidAmount <= highestBid) {
      alert("Bid must be higher than the current highest bid");
      return;
    }

    fetch("http://localhost:8080/api/bids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: loggedInUserId,
        auctionItemId: auctionItemId,
        bidAmount: bidAmount,
        bidTime: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Bid failed");
        return res.json();
      })
      .then((data) => {
        setHighestBid(data.bidAmount);
        setHighestBidder(data.user.username);
        setNewBid("");
      })
      .catch(() => {
        setErrorMessage("Bid submission failed");
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  const handleBuyNow = () => {
    fetch(`http://localhost:8080/api/auction-items/${auctionItemId}/buy-now`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUserId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Buy Now failed");
        setAuctionEnded(true);
        navigate("/bid-end");
      })
      .catch(() => {
        setErrorMessage("Failed to complete purchase");
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  if (errorMessage) return <p className="error-message text-red-500">{errorMessage}</p>;
  if (!auctionItem) return <p>Loading auction data...</p>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold">{auctionItem.itemName}</h2>
      <p>{auctionItem.itemDescription}</p>

      <div className="mt-4 p-4 border rounded bg-gray-100">
        <p>
          <strong>Highest Bid:</strong> ${highestBid.toFixed(2)}
        </p>
        <p>
          <strong>Highest Bidder:</strong> {highestBidder}
        </p>
      </div>

      {auctionEnded ? (
        <p className="mt-4 text-red-500 font-bold">Auction has ended.</p>
      ) : (
        <div className="mt-4">
          <input
            type="number"
            step="0.01"
            min={highestBid + 0.01}
            className="border p-2 rounded w-full"
            placeholder={`Enter bid > $${highestBid.toFixed(2)}`}
            value={newBid}
            onChange={(e) => setNewBid(e.target.value)}
          />
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded w-full"
            onClick={handleBuyNow}
          >
            Buy Now ${auctionItem.buyNowPrice?.toFixed(2) || "N/A"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OiledUpDutchOven;