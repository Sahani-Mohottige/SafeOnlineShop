import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/products/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Search Results for: "{query}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((product) => (
            <li key={product._id} className="border p-4 rounded-lg hover:bg-gray-50 transition">
              <Link to={`/product/${product._id}`} className="block">
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;