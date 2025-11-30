import React from "react";

function SortDropdown({ sortBy, setSortBy }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Sort:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating-desc">Rating: High → Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}

export default SortDropdown;
