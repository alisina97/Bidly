import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar'


const EditAuctionPage = () => {
  // Uncomment below when done testing
  const { auctionId } = useParams();
  const navigate = useNavigate();

  const [auctionItem, setAuctionItem] = useState(null);
  const [error, setError] = useState('');
  const [newBuyNowPrice, setNewBuyNowPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAuctionItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auction-items/${auctionId}`);
        setAuctionItem(response.data);
      } catch (err) {
        setError('Failed to fetch auction details.');
      }
    };

    fetchAuctionItem();
  }, [auctionId]);

  const handleUpdate = async () => {
    if (parseFloat(newBuyNowPrice) <= parseFloat(auctionItem.startingPrice)) {
      setErrorMessage('Buy Now Price must be greater than Starting Price.');
      setSuccessMessage('');
      return;
    }

    try {
      const updatedAuctionItem = await axios.put(
        `http://localhost:8080/api/auction-items/update/${auctionId}`,
        { buyNowPrice: newBuyNowPrice }
      );
      setAuctionItem(updatedAuctionItem.data);
      setSuccessMessage('Auction successfully updated');
      setErrorMessage('');
    } catch (err) {
      setError('Failed to update auction.');
      setSuccessMessage('');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Navbar></Navbar>
      <h1 style={{fontSize: '28px', marginBottom: '40px' }}><strong>Edit Auction</strong></h1>
	  
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {auctionItem ? (
        <div>
          <h3>Item Information</h3>
          <p><strong>Item Name:</strong> {auctionItem.itemName}</p>
          <p><strong>Description:</strong> {auctionItem.itemDescription}</p>
          <p><strong>Starting Price:</strong> ${auctionItem.startingPrice}</p>
          
          <div>
            <h3><strong>Current Buy Now Price:</strong> ${auctionItem.buyNowPrice}</h3>
          </div>

          <div>
            <h3>New Buy Now Price</h3>
            <input
              type="number"
              value={newBuyNowPrice}
              onChange={(e) => setNewBuyNowPrice(e.target.value)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                fontSize: '16px',
                border: '2px solid #ccc',
                borderRadius: '5px',
                width: '300px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button onClick={handleUpdate} style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: 'green', color: 'white', fontSize: '16px' }}>
            Update Auction
          </button>
		  <button 
		          onClick={() => navigate(`/myAuctions/${auctionItem.user.userId}`, { state: { auctionItem: auctionItem } })} 
		          style={{ marginTop: '20px', backgroundColor: 'gray', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
		        >
		          Back to My Auctions
		        </button>
          {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        </div>
      ) : (
        <p>Loading auction details...</p>
      )}
    </div>
  );
};

export default EditAuctionPage;