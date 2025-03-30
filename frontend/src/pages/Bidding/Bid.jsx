import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axiosInstance from '../../utils/axiosinstance';

function Bid() {
  const { auctionId } = useParams();
  const [auctionItem, setAuctionItem] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSession();
    fetchAuctionItem();
    fetchHighestBid();
  }, []);

  useEffect(() => {
    // generic time until I got some actual info
    let totalSeconds = (2 * 24 * 60 * 60) + (12 * 60 * 60) + (30 * 60) + 45;

    const updateTimer = () => {
      if (totalSeconds <= 0) {
        setTimeRemaining('Auction Ended');
        clearInterval(timerInterval);
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      totalSeconds--;
    };

    updateTimer(); // Initial call
    const timerInterval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(timerInterval);
  }, []);

  const fetchUserSession = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/users/me', { credentials: 'include' });
      if (!res.ok) throw new Error('User session not found. Please log in.');
      const data = await res.json();
      setUserId(data.userId || data.user_id); // handles both snake and camel cases
    } catch (err) {
      handleError(err, 'Error fetching user session.');
    }
  };

  const fetchAuctionItem = async () => {
    try {
      const response = await axiosInstance.get(`/api/auction-items/${auctionId}`);
      setAuctionItem(response.data);
    } catch (err) {
      handleError(err, 'Error fetching auction item.');
    }
  };

  const fetchHighestBid = async () => {
    try {
      const response = await axiosInstance.get(`/api/bids/auction/${auctionId}/highest`);
      setHighestBid(response.data);
    } catch (err) {
      handleError(err, 'Error fetching highest bid.');
    }
  };

  const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage;
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const handleBuyNow = async () => {
    if (!userId) {
      setError('You must be logged in to purchase.');
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('userId', userId);
      formData.append('auctionItemId', auctionId);

      await axiosInstance.post('/api/bids/buy-now', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      setSuccessMessage('Item purchased successfully!');
      setTimeout(() => {
        navigate('/bidend', {
          state: {
            auctionItemId: auctionId
          }
        });
      }, 1000);
          } catch (err) {
      handleError(err, 'Failed to complete purchase.');
    }
  };

  const handlePlaceBid = async () => {
    if (!userId) {
      setError('You must be logged in to place a bid.');
      return;
    }

    if (auctionItem && userId === auctionItem.userId) {
      setError('You cannot bid on your own auction.');
      return;
    }

    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      setError('Please enter a valid bid amount.');
      return;
    }

    const minBid = highestBid ? highestBid.bidAmount + 1 : auctionItem.startingPrice;
    if (parseFloat(bidAmount) < minBid) {
      setError(`Your bid must be at least $${minBid}.`);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('userId', userId);
      formData.append('auctionItemId', auctionId);
      formData.append('bidAmount', bidAmount);

      await axiosInstance.post('/api/bids/add', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      setBidAmount('');
      setSuccessMessage('Bid placed successfully!');
      setError('');
      fetchHighestBid();
    } catch (err) {
      handleError(err, 'Failed to place bid.');
    }
  };

  const isOwnAuction = auctionItem && userId === auctionItem.userId;

  return (
    <>
      <Navbar />
      <div className='max-w-screen-md mx-auto px-4 mt-6'>
        {error && <p className='text-red-500'>{error}</p>}
        {successMessage && <p className='text-green-500'>{successMessage}</p>}

        {auctionItem ? (
          <>
            <h1 className='text-2xl font-bold'>{auctionItem.itemName}</h1>
            <p className='mt-2'>{auctionItem.itemDescription}</p>
            <p className='mt-2 font-semibold'>Starting Price: ${auctionItem.startingPrice}</p>
            <p className='mt-2 font-semibold'>
              Highest Bid: {highestBid ? `$${highestBid.bidAmount}` : 'Be the first to bid.'}
            </p>
            <p className='mt-2 font-semibold'>Time Remaining: {timeRemaining}</p>

            {/* ✅ Show Buy Now button if categoryId === 2 */}
            {auctionItem.auctionType?.auctionTypeId === 2 && (
              <button
                className='mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                onClick={handleBuyNow}
              >
                Buy Now for ${auctionItem.buyNowPrice}
              </button>
            )}

            <div className='mt-6'>
              <h2 className='text-lg font-bold'>Place a Bid</h2>
              <input
                type='number'
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder='Enter your bid'
                className='border p-2 rounded w-full mt-2'
              />
             <button
                className={`mt-2 px-4 py-2 rounded text-white ${
                  isOwnAuction 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={handlePlaceBid}
                disabled={isOwnAuction}  >
                {isOwnAuction ? 'Cannot Bid on Own Item' : 'Place Bid'}
              </button>
              {isOwnAuction && (  // Added
                <p className='mt-2 text-gray-600'>Cannot Bid on your own product</p>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default Bid;
