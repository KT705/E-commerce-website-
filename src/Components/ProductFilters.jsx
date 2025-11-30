import React, { useState, useEffect } from "react";

function ProductFilters({ categories = [], filters = {}, onChange }) {
  // local copy so we can edit before pushing changes
  const [local, setLocal] = useState({
    categories: filters.categories || [],
    minPrice: filters.minPrice ?? "",
    maxPrice: filters.maxPrice ?? "",
    minRating: filters.minRating ?? 0,
  });

  useEffect(() => {
    setLocal({
      categories: filters.categories || [],
      minPrice: filters.minPrice ?? "",
      maxPrice: filters.maxPrice ?? "",
      minRating: filters.minRating ?? 0,
    });
  }, [filters]);

  const toggleCategory = (cat) => {
    setLocal(prev => {
      const exists = prev.categories.includes(cat);
      const nextCats = exists ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat];
      return { ...prev, categories: nextCats };
    });
  };

  const apply = () => {
    onChange({
      categories: local.categories,
      minPrice: local.minPrice,
      maxPrice: local.maxPrice,
      minRating: Number(local.minRating) || 0
    });
  };

  const clearLocal = () => {
    const cleared = { categories: [], minPrice: "", maxPrice: "", minRating: 0 };
    setLocal(cleared);
    onChange(cleared);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow space-y-4">
      <h3 className="font-bold">Filters</h3>

      <div>
        <h4 className="font-semibold text-sm mb-2">Categories</h4>
        <div className="flex flex-col gap-2 max-h-44 overflow-auto pr-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={local.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="cursor-pointer"
              />
              <span className="capitalize">{cat}</span>
            </label>
          ))}
          {categories.length === 0 && <div className="text-sm text-gray-500">No categories</div>}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2">Price</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={local.minPrice}
            onChange={(e) => setLocal(prev => ({...prev, minPrice: e.target.value}))}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={local.maxPrice}
            onChange={(e) => setLocal(prev => ({...prev, maxPrice: e.target.value}))}
            className="w-1/2 p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2">Minimum rating</h4>
        <div className="flex items-center gap-2">
          <select
            value={local.minRating}
            onChange={(e) => setLocal(prev => ({...prev, minRating: e.target.value}))}
            className="p-2 border rounded"
          >
            <option value={0}>Any</option>
            <option value={1}>1 star+</option>
            <option value={2}>2 stars+</option>
            <option value={3}>3 stars+</option>
            <option value={4}>4 stars+</option>
          </select>
          <div className="text-sm text-gray-600">{local.minRating ? `${local.minRating}+` : "Any"}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={apply} className="flex-1 bg-black text-white py-2 rounded">Apply</button>
        <button onClick={clearLocal} className="flex-1 border py-2 rounded">Clear</button>
      </div>
    </div>
  );
}

export default ProductFilters;
