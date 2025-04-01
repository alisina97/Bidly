import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure values passed via React Router's state
    const {
        auctionItemId,
        winner,
        auctionItem,
        userDetails,
        expeditedShipping,
        totalAmount
    } = location.state || {};

    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState("");

    // User-entered payment info
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [securityCode, setSecurityCode] = useState("");

    // Track whether the auction item is already paid
    const [isPaid, setIsPaid] = useState(false);

    // We'll store the response from mark-paid here to display on screen
    const [markPaidResponse, setMarkPaidResponse] = useState(null);

    // 1) Fetch user session to get logged-in user ID
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/me", { withCredentials: true })
            .then((res) => {
                setLoggedInUserId(res.data.user_id);
            })
            .catch(() => setError("User session not found. Please log in."));
    }, []);

    // 2) Fetch winner (to check `paidFor`) AND also fetch payment details.
    //    This ensures we know if it's already paid, and we also get user shipping info.
    useEffect(() => {
        if (!auctionItemId || !loggedInUserId) return;

        console.log("Auction Item ID from state:", auctionItemId);

        // First, get the Winner from /api/winners/{auctionItemId} to see if paidFor is true
        axios
            .get(`http://localhost:8080/api/winners/${auctionItemId}`, { withCredentials: true })
            .then((winnerRes) => {
                // If the winner object has `paidFor = true`, disable payment
                if (winnerRes.data?.paidFor) {
                    setIsPaid(true);
                }
                // Then fetch the shipping/payment details
                return axios.get("http://localhost:8080/api/payment/user-details", {
                    params: { userId: loggedInUserId, auctionItemId },
                    withCredentials: true,
                });
            })
            .then((detailsRes) => {
                setPaymentDetails(detailsRes.data);
                setError("");
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch winner or payment details. Please check the API.");
                setPaymentDetails(null);
            });
    }, [auctionItemId, loggedInUserId]);

    // 3) Handle Payment
    const handlePayment = async () => {
        // If already paid, don't process further
        if (isPaid) return;

        try {
            // 3a. Call the backend endpoint to mark as paid in DB
            const response = await axios.post(
                "http://localhost:8080/api/winners/mark-paid",
                null,
                {
                    params: { auctionItemId },
                    withCredentials: true,
                }
            );

            // 3b. On success, set local state to reflect paid
            setIsPaid(true);
            setMarkPaidResponse(response.data);

            // 3c. Build the arrival date (3 days from now)
            const arrivalDate = new Date();
            arrivalDate.setDate(arrivalDate.getDate() + 3);
            const formattedArrivalDate = arrivalDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });

            // 3d. Prepare receipt data
            const receiptData = {
                firstName: paymentDetails?.firstName || "N/A",
                lastName: paymentDetails?.lastName || "N/A",
                streetNumber: paymentDetails?.streetNumber || "N/A",
                streetName: paymentDetails?.streetName || "N/A",
                city: paymentDetails?.city || "N/A",
                country: paymentDetails?.country || "N/A",
                postalCode: paymentDetails?.postalCode || "N/A",
                totalAmountPaid: totalAmount,
                arrivalDate: formattedArrivalDate,
                itemId: auctionItemId,
                itemName: auctionItem?.itemName || "Auction Item",
            };

            // 3e. Navigate to the receipt page with the above data
            navigate("/receipt", { state: receiptData });

        } catch (err) {
            console.error("Error marking winner as paid:", err);
            setError("Could not mark as paid. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ textAlign: "center", padding: "20px", maxWidth: "900px", margin: "auto" }}>
                <h2>Payment Details</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Display the result from mark-paid if we have any */}
                {markPaidResponse && (
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Mark-Paid Response:</strong>{" "}
                        <pre>{JSON.stringify(markPaidResponse, null, 2)}</pre>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                    {/* Left Column: User & Shipping Info */}
                    <div
                        style={{
                            flex: 1,
                            border: "1px solid #ccc",
                            padding: "15px",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                            textAlign: "left",
                        }}
                    >
                        <h3>User Information</h3>
                        <p>
                            <strong>First Name:</strong>{" "}
                            {paymentDetails?.firstName || "Loading..."}
                        </p>
                        <p>
                            <strong>Last Name:</strong>{" "}
                            {paymentDetails?.lastName || "Loading..."}
                        </p>

                        <h3>Shipping Address</h3>
                        <p>
                            <strong>Street Number:</strong>{" "}
                            {paymentDetails?.streetNumber || "Loading..."}
                        </p>
                        <p>
                            <strong>Street Name:</strong>{" "}
                            {paymentDetails?.streetName || "Loading..."}
                        </p>
                        <p>
                            <strong>City:</strong>{" "}
                            {paymentDetails?.city || "Loading..."}
                        </p>
                        <p>
                            <strong>Country:</strong>{" "}
                            {paymentDetails?.country || "Loading..."}
                        </p>

                        <h3>Item Details</h3>
                        <p>
                            <strong>Total Price:</strong> ${totalAmount}
                        </p>
                    </div>

                    {/* Right Column: Payment Form & Button */}
                    <div
                        style={{
                            flex: 1,
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            textAlign: "left",
                        }}
                    >
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

                        {/* Disable button if already paid */}
                        <button
                            onClick={handlePayment}
                            style={{
                                backgroundColor: isPaid ? "gray" : "green",
                                color: "white",
                                padding: "10px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: isPaid ? "not-allowed" : "pointer",
                                width: "100%",
                            }}
                            disabled={isPaid}
                        >
                            {isPaid ? "Already Paid" : "Yes Proceed to Payment"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;
