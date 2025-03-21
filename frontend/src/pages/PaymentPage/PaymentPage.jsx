import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../../components/Navbar/Navbar';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { auctionItemId, winner, auctionItem, userDetails, expeditedShipping, totalAmount } = location.state || {};

    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState("");

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [securityCode, setSecurityCode] = useState("");

    // ✅ Fetch user session
    useEffect(() => {
        axios.get("http://localhost:8080/api/users/me", { withCredentials: true })
            .then(res => {
                console.log("User Session Response:", res.data);
                setLoggedInUserId(res.data.user_id); // ✅ using user_id based on your backend
            })
            .catch(() => setError("User session not found. Please log in."));
    }, []);

    // ✅ Fetch payment details after userId is set
    useEffect(() => {
        console.log("loggedInUserId:", loggedInUserId);
        console.log("auctionItemId:", auctionItemId);

        if (!loggedInUserId || !auctionItemId) return;

        axios.get("http://localhost:8080/api/payment/user-details", {
            params: { userId: loggedInUserId, auctionItemId },
            withCredentials: true
        })
            .then(res => {
                console.log("Payment Details Response:", res.data);
                setPaymentDetails(res.data);
                setError("");
            })
            .catch(err => {
                console.error("Payment Details Error:", err);
                setError("Failed to fetch payment details. Please check the API.");
                setPaymentDetails(null);
            });
    }, [loggedInUserId]);

    const handlePayment = () => {
        const arrivalDate = new Date();
        arrivalDate.setDate(arrivalDate.getDate() + 3);
        const formattedArrivalDate = arrivalDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        const receiptData = {
            firstName: paymentDetails?.firstName || "N/A",
            lastName: paymentDetails?.lastName || "N/A",
            streetNumber: paymentDetails?.streetNumber || "N/A",
            streetName: paymentDetails?.streetName || "N/A",
            city: paymentDetails?.city || "N/A",
            province: paymentDetails?.province || "N/A",
            country: paymentDetails?.country || "N/A",
            postalCode: paymentDetails?.postalCode || "N/A",
            totalAmountPaid: totalAmount,
            arrivalDate: formattedArrivalDate,
            itemId: auctionItemId,
            itemName: auctionItem?.itemName || "Auction Item",
        };

        navigate("/receipt", { state: receiptData });
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", maxWidth: "900px", margin: "auto" }}>
            <Navbar />
            <h2>Payment Details</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                {/* Left Column */}
                <div style={{ flex: 1, border: "1px solid #ccc", padding: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                    <h3>User Information</h3>
                    <p><strong>First Name:</strong> {paymentDetails?.firstName || "Loading..."}</p>
                    <p><strong>Last Name:</strong> {paymentDetails?.lastName || "Loading..."}</p>

                    <h3>Shipping Address</h3>
                    <p><strong>Street Number:</strong> {paymentDetails?.streetNumber || "Loading..."}</p>
                    <p><strong>Street Name:</strong> {paymentDetails?.streetName || "Loading..."}</p>
                    <p><strong>City:</strong> {paymentDetails?.city || "Loading..."}</p>
                    <p><strong>Province:</strong> {paymentDetails?.province || "Loading..."}</p>
                    <p><strong>Country:</strong> {paymentDetails?.country || "Loading..."}</p>

                    <h3>Item Details</h3>
                    <p><strong>Total Price:</strong> ${totalAmount}</p>
                </div>

                {/* Right Column */}
                <div style={{ flex: 1, padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff", textAlign: "left" }}>
                    <h3>Card Details</h3>
                    <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <input type="text" placeholder="Name on Card" value={cardName} onChange={(e) => setCardName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <input type="text" placeholder="Expiry Date (MM/YY)" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <input type="text" placeholder="Security Code (CVV)" value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

                    <button onClick={handlePayment} style={{ backgroundColor: "green", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
