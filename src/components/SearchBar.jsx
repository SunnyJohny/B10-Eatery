import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import foodData from "../data/foodData"; // ✅ updated to use food data

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const results = foodData.filter((dish) =>
      dish.name && dish.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(results);
  };

  const handleItemClick = (dish) => {
    setSelectedProduct(dish);
    setFilteredProducts([]);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md lg:px-24 px-4">
      <div className="w-full px-4 sm:px-4 lg:px-6 py-4 flex justify-center">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-100 rounded-full p-2 w-full max-w-lg h-12"
        >
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search dishes..."
            className="flex-grow bg-transparent border-none outline-none text-gray-700 px-4"
          />
          <button
            type="submit"
            className="bg-transparent border-none outline-none p-2"
          >
            <FaSearch className="text-gray-500 w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Search Results */}
      {filteredProducts.length > 0 && !selectedProduct && (
        <div
          className={`absolute mt-2 w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto ${
            isFocused ? "z-100002" : "z-50"
          }`}
        >
          {filteredProducts.map((dish) => (
            <div
              key={dish.id}
              className="flex items-center p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleItemClick(dish)}
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <span className="text-gray-700 text-sm font-medium">
                {dish.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Dish Display */}
      {selectedProduct && (
        <div className="mt-4 text-center relative">
          <button
            className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2"
            onClick={handleClose}
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="max-w-sm mx-auto rounded-lg shadow-lg"
          />
          <button
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert("Order placed!")}
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
