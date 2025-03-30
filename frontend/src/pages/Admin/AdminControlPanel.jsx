import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const AdminControlPanel = () => {
    return (
        <>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            
            {/* Users Table */}
            <div style={{ marginBottom: "40px" }}>
                <h2>Users Table</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Auctions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>1</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>john_doe</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>john@example.com</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>5</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>2</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>jane_smith</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>jane@example.com</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>3</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Selected User Table */}
            <div>
                <h2>Selected User</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Field</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>-</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Username</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>-</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Email</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>-</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Total Auctions</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>-</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Registration Date</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default AdminControlPanel;