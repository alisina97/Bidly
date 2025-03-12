import React, { useState, useEffect } from "react";
import axios from "axios";
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


		if (!userId) {
			setError("User session not found. Please log in.");
			return;
		}
		// Validate required fields
		if (!itemName || !itemDescription || !startingPrice || !auctionEndDate || !category) {
			setError("Please fill in all fields.");
			return;
		}


		// Check if auction end date is not in the past or the current date
		const currentDate = new Date();
		const endDate = new Date(auctionEndDate);

		// Calculate the duration between current date and auction end date
		const durationInSeconds = Math.floor((endDate - currentDate) / 1000); // Convert milliseconds to seconds
		console.log(durationInSeconds);

		// Ensure the duration is at least 12 hours (43200 seconds)
		if (durationInSeconds < 3600 * 12) { // 3600 seconds in an hour * 12 hours
			setError("Auction duration must be at least 12 hours.");
			return;
		}

		if (durationInSeconds > 3600 * 24 * 28) { // 3600 = seconds in an hour * 24 hours in a day * 28 days
			setError("Auction duration must be shorter than 28 days.");
			return;
		}

		// If auction type is Dutch, ensure Buy Now Price is greater than Starting Price
		if (auctionType === "dutch" && parseFloat(buyNowPrice) <= parseFloat(startingPrice)) {
			setError("Buy Now Price must be greater than the Starting Price.");
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

				setError(""); // Clear any previous error messages
			}
		} catch (err) {
			setError("Failed to create auction. Please try again.");
			setSuccessMessage(""); // Clear any previous success messages
		}
	};


	return (
		<div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
			<Navbar></Navbar>
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

			{error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
			{successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
		</div>
	);
};

export default CreateAuctionPage;
