import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateAuctionPage = () => {
  // State to hold auction form data
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");  // For Buy Now (Dutch Auction)
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [auctionType, setAuctionType] = useState("forward"); // 'forward' is default
  const [category, setCategory] = useState(""); // For selecting category
  const [categories, setCategories] = useState([]); // State to store fetched categories
  // const [images, setImages] = useState([]); // State for storing multiple images (commented out)
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Mapping auction types to IDs
  const auctionTypeMap = {
    forward: 1,  // Forward Auction (Regular)
    dutch: 2,    // Dutch Auction (Buy Now)
  };

  // Fetch categories from backend on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories");
        setCategories(response.data); // Assuming the backend returns an array of categories
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!itemName || !itemDescription || !startingPrice || !auctionEndDate || !category) {
      setError("Please fill in all fields.");
      return;
    }

    // Prepare auction data to be sent to backend
    const auctionData = new FormData();
    auctionData.append("itemName", itemName);
    auctionData.append("itemDescription", itemDescription);
    auctionData.append("startingPrice", parseFloat(startingPrice));
    auctionData.append("buyNowPrice", auctionType === "dutch" ? parseFloat(buyNowPrice) : 0); // Only include buyNowPrice for Dutch auctions
    auctionData.append("auctionTypeId", auctionTypeMap[auctionType]);
    auctionData.append("categoryId", category);
    auctionData.append("auctionEndDate", auctionEndDate);

    // Commented out image data processing
    // images.forEach((image) => {
    //   auctionData.append("images", image);
    // });

    try {
      // Send auction data to the backend
      const response = await axios.post("http://localhost:8080/api/auction-items/add", auctionData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads, though image upload is commented out
        },
      });

      // Handle success response
      if (response.status === 200) {
        setSuccessMessage("Auction created successfully!");
		// TODO: redirect to auction page
        setError(""); // Clear any previous error messages
      }
    } catch (err) {
      setError("Failed to create auction. Please try again.");
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  // Handle image uploads - Commented out
  // const handleImageChange = (event) => {
  //   setImages(event.target.files); // Capture all selected files (commented out)
  // };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create Auction</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label htmlFor="itemName"><strong>Item Name</strong></label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label htmlFor="itemDescription"><strong>Item Description</strong></label>
          <textarea
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Describe the item"
            required
            style={{ width: "100%", padding: "8px", minHeight: "100px" }}
          />
        </div>

        {/* Commented out Image Upload Section */}
        {/* <div>
          <label htmlFor="itemImages"><strong>Upload Images</strong></label>
          <input
            type="file"
            id="itemImages"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div> */}

        <div>
          <label htmlFor="startingPrice"><strong>Starting Price</strong></label>
          <input
            type="number"
            id="startingPrice"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="Enter starting price"
            required
            min="0.01"
            step="0.01"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {auctionType === "dutch" && (
          <div>
            <label htmlFor="buyNowPrice"><strong>Buy Now Price (Dutch Auction)</strong></label>
            <input
              type="number"
              id="buyNowPrice"
              value={buyNowPrice}
              onChange={(e) => setBuyNowPrice(e.target.value)}
              placeholder="Enter Buy Now Price"
              required
              min="0.01"
              step="0.01"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        )}

        <div>
          <label htmlFor="auctionEndDate"><strong>Auction End Date</strong></label>
          <input
            type="datetime-local"
            id="auctionEndDate"
            value={auctionEndDate}
            onChange={(e) => setAuctionEndDate(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label htmlFor="auctionType"><strong>Auction Type</strong></label>
          <select
            id="auctionType"
            value={auctionType}
            onChange={(e) => setAuctionType(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="forward">Regular Auction</option>
            <option value="dutch">Dutch Auction (Buy Now)</option>
          </select>
        </div>

        {/* Dynamic Category Dropdown */}
        <div>
          <label htmlFor="category"><strong>Category</strong></label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{ backgroundColor: "green", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}
        >
          Create Auction
        </button>
      </form>

      {/* Display error or success message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
    </div>
  );
};

export default CreateAuctionPage;
