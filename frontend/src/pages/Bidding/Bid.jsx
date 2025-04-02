import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axiosInstance from '../../utils/axiosinstance';

function Bid() {
  const { auctionId } = useParams();
  const [auctionItem, setAuctionItem] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [winningBid, setWinningBid] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('Loading...');
  const navigate = useNavigate();
  const isOwnAuction = auctionItem && userId === auctionItem.userId;

  useEffect(() => {
    fetchUserSession();
    fetchAuctionItem();
    fetchAuctionStatus();
    fetchHighestBid();
  }, []);

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  useEffect(() => {
    if (auctionStatus == null) { delay(100) }

    const endDate = auctionStatus?.endTimeEpoch;
    if (!endDate) {
      console.error('Auction end date not found in auction item:', auctionItem);
      setTimeRemaining('End date not available');
      return;
    }

    const endDateInMs = parseInt(endDate) * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const totalSeconds = Math.floor((endDateInMs - now) / 1000);

      if (totalSeconds <= 0) {
        setTimeRemaining('Auction Ended');
        clearInterval(timerInterval);
        if (highestBid) {
          setWinningBid(highestBid);
          const auctionData = new FormData();
          auctionData.append("user", winningBid.userId);
				  auctionData.append("auctionItem", auctionItem);
				  auctionData.append("winningPrice", highestBid);

          try {
            const response =axios.post("http://localhost:8080/api/winners/add", auctionData, {
              headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
              },
            });
          } catch (err) {
            const { status, data } = error.response;
          switch (status) {
          case 400:
            setError("Something went wrong with request"); // unexpected error
            break;
          case 429:
            setError("Too Many Requests, Try again Later"); // database overflow
            break;
          default:
            setError(data.message || "An unknown error occurred"); // generic error
          }
            setSuccessMessage(""); // Clear any previous success messages
            setIsSubmitting(false); // Re-enable button on error
          }
        }
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setTimeRemaining(timeString);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [auctionItem, auctionStatus, highestBid]);

  const fetchUserSession = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/users/me', { credentials: 'include' });
      if (!res.ok) throw new Error('User session not found. Please log in.');
      const data = await res.json();
      setUserId(data.userId || data.user_id);
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

  const fetchAuctionStatus = async () => {
    try {
      const response = await axiosInstance.get(`/api/auction-status/${auctionId}`);
      setAuctionStatus(response.data);
    } catch (err) {
      handleError(err, 'Error fetching auction item.');
    }
  };

  const fetchHighestBid = async () => {
    try {
      const response = await axiosInstance.get(`/api/bids/auction/${auctionId}/highest`);
      setHighestBid(response.data);
      console.log('Highest bid fetched:', response.data);
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
            auctionItemId: auctionId,
          },
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

    if (auctionItem.buyNowPrice && parseFloat(bidAmount) >= auctionItem.buyNowPrice) {
      setError(
        `Your bid is above the Buy Now price ($${auctionItem.buyNowPrice}). ` +
        `Please click "Buy Now" to purchase immediately.`
      );
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
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      handleError(err, 'Failed to place bid.');
    }
  };

  const isAuctionEnded = timeRemaining === 'Auction Ended';

  return (
    <>
      <Navbar />
      <div className='max-w-screen-md mx-auto px-4 mt-6'>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {successMessage && <p className='text-green-500 mb-4'>{successMessage}</p>}

        {auctionItem ? (
          <>
            <h1 className='text-2xl font-bold'>{auctionItem.itemName}</h1>
            <p className='mt-2'>{auctionItem.itemDescription}</p>
            <p className='mt-2 font-semibold'>
              Starting Price: ${auctionItem.startingPrice.toLocaleString()}
            </p>
            <p className='mt-2 font-semibold'>
              Highest Bid: {highestBid ? (
                <>
                  ${highestBid.bidAmount.toLocaleString()} by User{' '}
                  {highestBid.userId === userId ? 'You' : highestBid.userId}
                </>
              ) : (
                'Be the first to bid.'
              )}
            </p>
            {isAuctionEnded && winningBid && (
              <p className='mt-2 font-semibold text-green-600'>
                Winning Bid: ${winningBid.bidAmount.toLocaleString()} by User{' '}
                {winningBid.userId === userId ? 'You' : winningBid.userId}
              </p>
            )}
            <p className='mt-2 font-semibold'>
              Time Remaining: {timeRemaining || 'Calculating...'}
            </p>

            {auctionItem.auctionType?.auctionTypeId === 2 && (
              <button
                className={`mt-4 px-6 py-2 rounded text-white font-semibold ${
                  isAuctionEnded ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                }`}
                onClick={handleBuyNow}
                disabled={isAuctionEnded}
              >
                {isAuctionEnded ? 'Auction Ended' : `Buy Now for $${auctionItem.buyNowPrice}`}
              </button>
            )}

            <div className='mt-6'>
              <h2 className='text-lg font-bold'>Place a Bid</h2>
              {isOwnAuction ? (
                <p className='text-gray-600 mt-2'>You cannot bid on your own product.</p>
              ) : (
                <>
                  {isAuctionEnded && <p className='text-red-500 mt-2'>Auction is over. No more bids accepted.</p>}
                  <input
                    type='number'
                    value={bidAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (Number(value) >= 0 && Number.isInteger(Number(value)))) {
                        setBidAmount(value);
                      }
                    }}
                    placeholder='Enter your bid'
                    className={`border p-2 rounded w-full mt-2 ${
                      isAuctionEnded ? 'bg-gray-200 cursor-not-allowed' : ''
                    }`}
                    disabled={isAuctionEnded}
                    min='0'
                    step='1'
                  />
                  <button
                    className={`mt-2 px-6 py-2 rounded text-white font-semibold ${
                      isAuctionEnded ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={handlePlaceBid}
                    disabled={isAuctionEnded}
                  >
                    {isAuctionEnded ? 'Auction Ended' : 'Place Bid'}
                  </button>
                </>
              )}
            </div>
          </>
        ) : error ? (
          <p className='text-red-500'>Failed to load auction item. Please try again later.</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default Bid;