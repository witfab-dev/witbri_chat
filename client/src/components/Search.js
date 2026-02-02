import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoCloseCircle, IoTimeOutline } from 'react-icons/io5';

const Search = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Mock Data
  const allUsers = [
    { id: 1, username: 'witbri_official', fullName: 'WitbriChat', img: 'https://picsum.photos/50/50?random=1' },
    { id: 2, username: 'tech_innovator', fullName: 'Sarah Chen', img: 'https://picsum.photos/50/50?random=2' },
    { id: 3, username: 'design_daily', fullName: 'Graphic Design', img: 'https://picsum.photos/50/50?random=3' },
    { id: 4, username: 'react_coder', fullName: 'Dev Pro', img: 'https://picsum.photos/50/50?random=4' },
  ];

  // Filtering Logic
  useEffect(() => {
    if (query.trim() === "") {
      setResults(allUsers); // Show "suggested" when empty
    } else {
      const filtered = allUsers.filter(u => 
        u.username.toLowerCase().includes(query.toLowerCase()) || 
        u.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query]);

  return (
    <>
      {/* Invisible backdrop to close when clicking outside */}
      {isOpen && <div className="search-backdrop" onClick={onClose} />}

      <div className={`search-panel ${isOpen ? 'open' : ''}`}>
        <div className="search-header">
          <h2 className="search-title">Search</h2>
          <div className="search-input-container">
            <IoSearchOutline className="inner-search-icon" />
            <input 
              type="text" 
              placeholder="Search" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus={isOpen}
            />
            {query && (
              <IoCloseCircle 
                className="clear-query-icon" 
                onClick={() => setQuery("")} 
              />
            )}
          </div>
        </div>

        <div className="search-results-area">
          <div className="results-header">
            <span>{query === "" ? "Recent" : "Results"}</span>
            {query === "" && <button className="clear-all-link">Clear all</button>}
          </div>

          <div className="results-list">
            {results.length > 0 ? (
              results.map(user => (
                <div key={user.id} className="search-result-item">
                  <img src={user.img} alt={user.username} />
                  <div className="user-meta">
                    <span className="u-name">{user.username}</span>
                    <span className="f-name">{user.fullName}</span>
                  </div>
                  {query === "" && <IoCloseCircle className="remove-item" />}
                </div>
              ))
            ) : (
              <p className="no-results">No results found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;