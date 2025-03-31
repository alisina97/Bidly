import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar'

const UserAuctionsPage = () => {
  const [userId, setUserId] = useState(null); // Store user ID from session
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState('');
  
  
  useEffect(() => {
  	const fetchUserSession = async () => {
  		try {
  			const response = await axios.get("http://localhost:8080/api/users/me", {
  				withCredentials: true,
  			});
  			setUserId(response.data.user_id); // ✅ Store user ID in state
  		} catch (err) {
  			setError("User session not found. Please log in.");
  		}
  	};
  	fetchUserSession();
  }, []);

  useEffect(() => {
	if (!userId) return; // Ensure userId is set before fetching auctions
    const fetchUserAuctions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auction-items/user/${userId}`);
        setAuctions(response.data);
      } catch (err) {
        setError('Failed to fetch user auctions.');
      }
    };

    fetchUserAuctions();
  }, [userId]);

  return (
      <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Your Auctions</h2>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p> // Only show the error message ("User session not found. Please log in.")
        ) : auctions.length > 0 ? (
          <ul>
            {auctions.map((auction) => (
              <li key={auction.auctionItemId} style={{ marginBottom: '10px' }}>
                <p><strong>{auction.itemName}</strong></p>
                <p>{auction.itemDescription}</p>
                <p>Starting Price: ${auction.startingPrice}</p>
                {auction.auctionType.auctionTypeId === 2 && (
                  <>
                    <p>Buy Now Price: ${auction.buyNowPrice}</p>
                    <button 
                      onClick={() => navigate(`/edit/${auction.auctionItemId}`, { state: { auctionItem: auction } })} 
                      style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Edit Buy Now Price
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no auctions.</p> // Only shown when user is logged in and has no auctions
        )}
        <button 
          onClick={() => navigate('/sell')} 
          disabled={!userId} // Disable button when userId is null
          style={{ 
            marginTop: '20px', 
            backgroundColor: !userId ? '#ccc' : 'green', // Gray when disabled, green when enabled
            color: 'white', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: !userId ? 'not-allowed' : 'pointer' // Adjust cursor based on state
          }}
        >
          Sell an Item
        </button>
      </div>
      </>
  );
};

export default UserAuctionsPage;
