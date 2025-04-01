import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const ReceiptPage = () => {
    const location = useLocation();
    const paymentDetails = location.state;

    if (!paymentDetails) {
        return <p style={{ textAlign: "center", color: "red" }}>No receipt data available.</p>;
    }

	return (
	    <>
	      <Navbar />
	      <div
	        style={{
	          textAlign: "center",
	          padding: "20px",
	          maxWidth: "900px",
	          margin: "auto",
	        }}
	      >
	        <h2>Receipt</h2>

	        <div
	          style={{
	            display: "flex",
	            justifyContent: "space-between",
	            gap: "20px",
	          }}
	        >
	          {/* Left Column: Payment Details */}
	          <div
	            style={{
	              flex: 1,
	              padding: "15px",
	              border: "1px solid #ccc",
	              borderRadius: "8px",
	              backgroundColor: "#f9f9f9",
	              textAlign: "left",
	            }}
	          >
	            <h3>Congratulations!</h3>
	            <p style={{ color: "green", fontSize: "18px" }}>
	              You have won the auction for the item:
	            </p>
	            <p>
	              <strong>Item Name:</strong> {paymentDetails.itemName}
	            </p>
	            <p>
	              <strong>Item ID:</strong> {paymentDetails.itemId}
	            </p>

	            <h3>User Information</h3>
	            <p>
	              <strong>First Name:</strong> {paymentDetails.firstName}
	            </p>
	            <p>
	              <strong>Last Name:</strong> {paymentDetails.lastName}
	            </p>

	            <h3>Shipping Address</h3>
	            <p>
	              <strong>Street Number:</strong> {paymentDetails.streetNumber}
	            </p>
	            <p>
	              <strong>Street Name:</strong> {paymentDetails.streetName}
	            </p>
	            <p>
	              <strong>City:</strong> {paymentDetails.city}
	            </p>
	            <p>
	              <strong>Province:</strong> {paymentDetails.province}
	            </p>
	            <p>
	              <strong>Country:</strong> {paymentDetails.country}
	            </p>
	            <p>
	              <strong>Postal Code:</strong> {paymentDetails.postalCode}
	            </p>

	            <h3>Total Amount Paid</h3>
	            <p>
	              <strong>Total:</strong> $
	              {paymentDetails.totalAmountPaid.toFixed(2)}
	            </p>

	            <h3>Shipping and Arrival</h3>
	            <p>
	              <strong>Estimated Arrival Date:</strong> {paymentDetails.arrivalDate}
	            </p>
	          </div>
	        </div>
	      </div>
	    </>
	  );
	};

export default ReceiptPage;
