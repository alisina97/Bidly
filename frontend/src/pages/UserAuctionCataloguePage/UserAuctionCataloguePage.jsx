import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar'

const UserAuctionsPage = () => {
  const userId = 1; // Hardcoded user ID
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Navbar></Navbar>
      <h2>Your Auctions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {auctions.length > 0 ? (
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
        <p>You have no auctions.</p>
      )}
      <button 
        onClick={() => navigate('/sell')} 
        style={{ marginTop: '20px', backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
      >
        Sell an Item
      </button>
    </div>
  );
};

export default UserAuctionsPage;
