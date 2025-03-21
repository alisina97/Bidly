import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import axiosInstance from '../../utils/axiosinstance';

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [allAuctions, setAllAuctions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllAuctions();
  }, [currentPage]);

  const fetchAllAuctions = async () => {
    try {
      const response = await axiosInstance.get("/api/auction-items");
      const auctionsWithDetails = await Promise.all(response.data.map(async (item) => {
        try {
          const statusResponse = await axiosInstance.get(`/api/auction-status/${item.auctionItemId}`);
          const highestBidResponse = await axiosInstance.get(`/api/bids/auction/${item.auctionItemId}/highest`);
          return { 
            ...item, 
            status: statusResponse.data.itemStatus, 
            highestBid: highestBidResponse.data ? highestBidResponse.data.bidAmount || "N/A" : "N/A" 
          };
        } catch (error) {
          console.error("Error fetching auction status or highest bid:", error);
          return { ...item, status: "UNKNOWN", highestBid: "N/A" };
        }
      }));
      setAllAuctions(auctionsWithDetails);
      setIsSearch(true);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      try {
        const response = await axiosInstance.get("/api/auction-items/search", {
          params: { keyword: searchQuery },
        });
        setIsSearch(true);
        setAllAuctions(response.data);
      } catch (error) {
        console.error("Search API Error:", error);
      }
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    setSearchQuery("");
    setCurrentPage(1);
    fetchAllAuctions();
  };

  const handleBid = (auctionItemId) => {
    navigate(`/auction/bid/${auctionItemId}`);
  };

  const totalPages = Math.ceil(allAuctions.length / itemsPerPage);
  const paginatedAuctions = allAuctions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Navbar />
      <div className='max-w-screen-xl mx-auto px-2'>
        <h1 className='mb-6 mt-6'>Browse Auctions</h1>

        <SearchBar 
          value={searchQuery} 
          onChange={({ target }) => setSearchQuery(target.value)} 
          handleSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />

        {isSearch && (
          <div className="mt-5">
            <h2 className="text-lg font-bold mb-3">Auction Items</h2>
            <div className="grid grid-cols-5 gap-4">
              {paginatedAuctions.map((item) => (
                <div key={item.auctionItemId} className="border p-4 rounded-lg shadow hover:shadow-md">
                  <h3 className="font-semibold">{item.itemName}</h3>
                  <p>Starting Price: ${item.startingPrice}</p>
                  <p>Type: {item.auctionType?.auctionTypeName || "Unknown"}</p>
                  {item.auctionType?.auctionTypeName === "Buy Now" && (
                    <p>Buy Now Price: ${item.buyNowPrice || "N/A"}</p>
                  )}
                  <p>Highest Bid: ${item.highestBid || "N/A"}</p>
                  {item.status === "SOLD" ? (
                    <div>
                      <p className="text-red-500 font-bold">SOLD</p>
                      <button 
                        className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        onClick={() => navigate('/bidend', { state: { auctionItemId: item.auctionItemId } })}
                      >
                        View Details
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleBid(item.auctionItemId)}
                    >
                      Bid
                    </button>
                  )}

                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button 
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;