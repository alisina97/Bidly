import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const EditAuctionPage = () => {
  // Uncomment below when done testing 
  // const { auctionId } = useParams();  // Get the auction ID from URL
  const auctionId = 1; //temporary hard code
  const navigate = useNavigate();  // Use navigate for redirection
  
  const [auctionItem, setAuctionItem] = useState(null);
  const [error, setError] = useState('');
  const [newBuyNowPrice, setNewBuyNowPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch auction details based on auctionId
  useEffect(() => {
    const fetchAuctionItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auction-items/${auctionId}`);
        setAuctionItem(response.data);
        setNewBuyNowPrice(response.data.buyNowPrice);
      } catch (err) {
        setError('Failed to fetch auction details.');
      }
    };

    fetchAuctionItem();
  }, [auctionId]);

  const handleUpdate = async () => {
    // Ensure Buy Now Price is greater than Starting Price
    if (parseFloat(newBuyNowPrice) <= parseFloat(auctionItem.startingPrice)) {
      setErrorMessage('Buy Now Price must be greater than Starting Price.');
      return;
    }

    try {
      const updatedAuctionItem = await axios.put(
        `http://localhost:8080/api/auction-items/update/${auctionId}`,
        { buyNowPrice: newBuyNowPrice }
      );
      setAuctionItem(updatedAuctionItem.data);
      alert('Auction updated successfully!');
	  // TODO: navigate to updated auction page
    } catch (err) {
      setError('Failed to update auction.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Edit Auction</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {auctionItem ? (
        <div>
          <h3>Item Information</h3>
          <p><strong>Item Name:</strong> {auctionItem.itemName}</p>
          <p><strong>Description:</strong> {auctionItem.itemDescription}</p>
          <p><strong>Starting Price:</strong> ${auctionItem.startingPrice}</p>
          
          <div>
            <h3>Buy Now Price</h3>
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
        </div>
      ) : (
        <p>Loading auction details...</p>
      )}
    </div>
  );
};

export default EditAuctionPage;
