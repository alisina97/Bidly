import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const CreateAuctionPage = () => {
	// State to hold auction form data
	const [userId, setUserId] = useState(null); // Store user ID from session
	const [itemName, setItemName] = useState("");
	const [itemDescription, setItemDescription] = useState("");
	const [startingPrice, setStartingPrice] = useState("");
	const [buyNowPrice, setBuyNowPrice] = useState("");  // For Buy Now (Dutch Auction)
	const [auctionEndDate, setAuctionEndDate] = useState("");
	const [auctionType, setAuctionType] = useState("forward"); // 'forward' is default
	const [category, setCategory] = useState(""); // For selecting category
	const [categories, setCategories] = useState([]); // State to store fetched categories
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false); //

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


	const handleSubmit = async (event) => {
		event.preventDefault();

		// For when user gets timed out
		if (!userId) {
			setError("User session not found. Please log in.");
			return;
		}
		// Validate required fields
		if (!itemName && !itemDescription && !startingPrice && !auctionEndDate && !category) {		
			setError("Fields cannot be empty");
			return;
		}else if (!itemName) {		
			setError("Item name cannot be blank.");
			return;
		}else if (!itemDescription) {		
			setError("Item Description cannot be blank");
			return;
		}else if (!startingPrice) {		
			setError("Starting price cannot be blank");
			return;
		}else if (!auctionEndDate) {		
			setError("Auction Date is required");
			return;
		}else if (!category) {		
			setError("Category is Required");
			return;
		} else if (startingPrice < 0){
			setError("Starting Price cannot be less than 0");
			return;
		} else {

			// Check if auction end date is not in the past or the current date
			const currentDate = new Date();
			const endDate = new Date(auctionEndDate);

			// Calculate the duration between current date and auction end date
			const durationInSeconds = Math.floor((endDate - currentDate) / 1000); // Convert milliseconds to seconds
			console.log(durationInSeconds);

			// Ensure the duration is at least 12 hours
			if (durationInSeconds < 3600 * 12) { // 3600 seconds in an hour * 12 hours
				setError("Auction duration cannot be less than 12 hours.");
				return;
			}
			// Prevent auctions beyond 28 days
			else if (durationInSeconds > 3600 * 24 * 28) { // 3600 = seconds in an hour * 24 hours in a day * 28 days
				setError("Auction duration cannot be longer than 28 days.");
				return;
			}
			// If auction type is Dutch, ensure Buy Now Price is greater than Starting Price
			else if (auctionType === "dutch" && parseFloat(buyNowPrice) <= parseFloat(startingPrice)) {
				setError("You cannot make the Price less than the starting price");
				return;
			}
			else{
			setIsSubmitting(true); // Disable button during submission

				// Prepare auction data to be sent to backend
				const auctionData = new FormData();
				auctionData.append("itemName", itemName);
				auctionData.append("itemDescription", itemDescription);
				auctionData.append("startingPrice", parseFloat(startingPrice));
				auctionData.append("buyNowPrice", auctionType === "dutch" ? parseFloat(buyNowPrice) : 0); // Only include buyNowPrice for Dutch auctions
				auctionData.append("auctionTypeId", auctionTypeMap[auctionType]);
				auctionData.append("categoryId", category);
				auctionData.append("auctionEndDate", auctionEndDate);
				auctionData.append("userId", userId); // ✅ FIX: Ensure user ID is included
				try {
					// Send auction data to the backend

					const response = await axios.post("http://localhost:8080/api/auction-items/add", auctionData, {
						headers: {
							"Content-Type": "multipart/form-data", // Important for file uploads
						},
					});

					console.log(response);

					// Handle success response
					if (response.status === 200) {
						const auctionItemId = response.data.auctionItemId; // Assuming the backend returns the auction item ID
						setSuccessMessage("Auction created successfully!");

						// Create auction status for the created auction item
						await axios.post("http://localhost:8080/api/auction-status/create", null, {
							params: {
								auctionItemId: auctionItemId,
								startingPrice: parseFloat(startingPrice),
								durationSeconds: durationInSeconds, // Pass the correct duration in seconds
							},
						});

						setTimeout(() => navigate(`/myAuctions/${userId}`), 2000);
						setError(""); // Clear any previous error messages
					} 
				} catch (err) {
					const { status, data } = error.response;
				switch (status) {
				case 400:
					setError("Auction Creation failed. Bad request"); // password or username mismatch
					break;
				case 429:
					setError("Too Many Requests, Try again Later"); // database overflow from login attempts
					break;
				default:
					setError(data.message || "An unknown error occurred during creating an auction"); // generic error
				}
					setSuccessMessage(""); // Clear any previous success messages
					setIsSubmitting(false); // Re-enable button on error
				}
			}
		}
	};


	return (
        <>
            <Navbar />
            <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
                <h2 style={{ marginBottom: "20px" }}>Create Auction</h2>

                {error && <p style={{ color: "#ff4444", marginBottom: "10px" }}>{error}</p>}
                {successMessage && <p style={{ color: "#00C851", marginBottom: "10px" }}>{successMessage}</p>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="itemName" style={{ fontWeight: "bold" }}>Item Name</label>
                        <input
                            type="text"
                            id="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Enter item name"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="itemDescription" style={{ fontWeight: "bold" }}>Item Description</label>
                        <textarea
                            id="itemDescription"
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                            placeholder="Describe the item"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                minHeight: "100px",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="auctionType" style={{ fontWeight: "bold" }}>Auction Type</label>
                        <select
                            id="auctionType"
                            value={auctionType}
                            onChange={(e) => setAuctionType(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        >
                            <option value="forward">Regular Auction</option>
                            <option value="dutch">Dutch Auction (Buy Now)</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="startingPrice" style={{ fontWeight: "bold" }}>Starting Price</label>
                        <input
                            type="number"
                            id="startingPrice"
                            value={startingPrice}
                            onChange={(e) => setStartingPrice(e.target.value)}
                            placeholder="Enter starting price"
                            required
                            min="0.01"
                            step="0.01"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    {auctionType === "dutch" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label htmlFor="buyNowPrice" style={{ fontWeight: "bold" }}>Buy Now Price (Dutch Auction)</label>
                            <input
                                type="number"
                                id="buyNowPrice"
                                value={buyNowPrice}
                                onChange={(e) => setBuyNowPrice(e.target.value)}
                                placeholder="Enter Buy Now Price"
                                required
                                min="0.01"
                                step="0.01"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="auctionEndDate" style={{ fontWeight: "bold" }}>Auction End Date</label>
                        <input
                            type="datetime-local"
                            id="auctionEndDate"
                            value={auctionEndDate}
                            onChange={(e) => setAuctionEndDate(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="category" style={{ fontWeight: "bold" }}>Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
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
                        disabled={isSubmitting || !userId}
                        style={{
                            backgroundColor: (isSubmitting || !userId) ? "#ccc" : "#00C851",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: (isSubmitting || !userId) ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}>
                        {isSubmitting ? "Creating..." : "Create Auction"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateAuctionPage;
