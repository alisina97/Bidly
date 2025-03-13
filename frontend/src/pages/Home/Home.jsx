import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import axiosInstance from '../../utils/axiosinstance';

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [allAuctions, setAllAuctions] = useState([]);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);

  const onSearchAuction = async (query) => {
    try {
      const response = await axiosInstance.get("/api/auction-items/search", {
        params: { keyword: query },
      });

      console.log("Search Response:", response.data);

      if (response.data.length > 0) {
        setIsSearch(true);
        setAllAuctions(response.data);
      } else {
        setIsSearch(false);
        setAllAuctions([]);
        console.log("No auction items found.");
      }
    } catch (error) {
      console.error("Search API Error:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      onSearchAuction(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    setSearchQuery("");
    setAllAuctions([]);
    setSelectedAuctionId(null);
  };

  const handleSelectAuction = (auctionItemId) => {
    setSelectedAuctionId(auctionItemId);
  };

  const handleBid = () => {
    if (selectedAuctionId) {
      console.log(`Placing bid for auction item ID: ${selectedAuctionId}`);
      alert(`Bid placed for auction item ID: ${selectedAuctionId}`);
    } else {
      alert("Please select an auction item to bid.");
    }
  };

  return (
    <>
      <Navbar />
      <div className='max-w-screen-xl mx-auto px-2'>
        <h1 className='mb-6 mt-6'>Please search an item to start</h1>

        <SearchBar 
          value={searchQuery} 
          onChange={({ target }) => setSearchQuery(target.value)} 
          handleSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />

        {isSearch && (
          <div className="mt-5">
            <h2 className="text-lg font-bold mb-3">Search Results</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Item Name</th>
                  <th className="border border-gray-300 px-4 py-2">Current Price</th>
                  <th className="border border-gray-300 px-4 py-2">Auction Type</th>
                  <th className="border border-gray-300 px-4 py-2">Remaining Time</th>
                  <th className="border border-gray-300 px-4 py-2">Select</th>
                </tr>
              </thead>
              <tbody>
                {allAuctions.map((item) => (
                  <tr key={item.auctionItemId} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                    <td className="border border-gray-300 px-4 py-2">${item.startingPrice}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.auctionType?.auctionTypeName || "Unknown"}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.remainingTime || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input 
                        type="radio" 
                        name="auctionSelection" 
                        value={item.auctionItemId} 
                        checked={selectedAuctionId === item.auctionItemId}
                        onChange={() => handleSelectAuction(item.auctionItemId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button 
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleBid}
            >
              Bid
            </button>
          </div>
        )}
        </div>
    </>
  );
}

export default Home;