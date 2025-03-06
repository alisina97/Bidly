import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentPage = () => {
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState("");
    
    // New state for card details
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [securityCode, setSecurityCode] = useState("");

    // Automatically fetch payment details when the page loads
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/payment/user-details", {
                    params: { userId: 1, auctionItemId: 1 } // Hardcoded values
                });
                setPaymentDetails(response.data);
                setError(""); // Clear errors
            } catch (err) {
                setError("Failed to fetch payment details. Please check the API.");
                setPaymentDetails(null);
            }
        };

        fetchPaymentDetails();
    }, []); // Empty dependency array ensures it runs only once on page load

    return (
        <div style={{ textAlign: "center", padding: "20px", maxWidth: "900px", margin: "auto" }}>
            <h2>Payment Details</h2>

            {/* Two-column layout */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                
                {/* Left Column: Payment Details */}
                <div style={{ flex: 1, border: "1px solid #ccc", padding: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                    {paymentDetails ? (
                        <>
                            <h3>User Information</h3>
                            <p><strong>First Name:</strong> {paymentDetails.firstName}</p>
                            <p><strong>Last Name:</strong> {paymentDetails.lastName}</p>

                            <h3>Shipping Address</h3>
                            <p><strong>Street Number:</strong> {paymentDetails.streetNumber}</p>
                            <p><strong>Street Name:</strong> {paymentDetails.streetName}</p>
                            <p><strong>City:</strong> {paymentDetails.city}</p>
                            <p><strong>Province:</strong> {paymentDetails.province}</p>
                            <p><strong>Country:</strong> {paymentDetails.country}</p>

                            <h3>Item Details</h3>
                            <p><strong>Price:</strong> ${paymentDetails.price}</p>
                        </>
                    ) : (
                        <p>Loading payment details...</p>
                    )}
                </div>

                {/* Right Column: Card Details Form */}
                <div style={{ flex: 1, padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff", textAlign: "left" }}>
                    <h3>Card Details</h3>
                    <input 
                        type="text" 
                        placeholder="Card Number" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)} 
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />
                    <input 
                        type="text" 
                        placeholder="Name on Card" 
                        value={cardName} 
                        onChange={(e) => setCardName(e.target.value)} 
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />
                    <input 
                        type="text" 
                        placeholder="Expiry Date (MM/YY)" 
                        value={expiryDate} 
                        onChange={(e) => setExpiryDate(e.target.value)} 
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />
                    <input 
                        type="text" 
                        placeholder="Security Code (CVV)" 
                        value={securityCode} 
                        onChange={(e) => setSecurityCode(e.target.value)} 
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />

                    <button 
                        style={{ backgroundColor: "green", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>

            {/* Display error message if any */}
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
    );
};

export default PaymentPage;
