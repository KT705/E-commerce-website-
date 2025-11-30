import { useState, useEffect, useMemo } from "react";
import ProductCard from "../Components/ProductCard";
import { getLatestProducts } from "../services/api"; 
import ProductFilters from "../Components/ProductFilters";
import SortDropdown from "../Components/SortDropdown";
import { Link } from "react-router-dom";

function ProductList(){
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],    // selected category slugs
    minPrice: "",
    maxPrice: "",
    minRating: 0
  });
  const [sortBy, setSortBy] = useState("relevance"); // options: relevance, price-asc, price-desc, rating-desc, newest
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // derived categories
  const categories = useMemo(() => {
    const setCats = new Set(allProducts.map(p => p.category));
    return Array.from(setCats);
  }, [allProducts]);

  useEffect(() => {
    const loadProducts = async () => {
      try{
        setLoading(true);
        const latestProducts = await getLatestProducts();
        setAllProducts(latestProducts);
        setError(null);
      }catch(err){
        console.error(err);
        setError("Failed to load products from database, try again");
      }finally{
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // filter + sort logic memoized
  const filteredAndSorted = useMemo(() => {
    let result = [...allProducts];

    // search
    const q = searchQuery.trim().toLowerCase();
    if(q){
      result = result.filter(product =>
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    }

    // categories (if any selected)
    if(filters.categories.length > 0){
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // price
    const minP = parseFloat(filters.minPrice);
    const maxP = parseFloat(filters.maxPrice);
    if(!Number.isNaN(minP)){
      result = result.filter(p => p.price >= minP);
    }
    if(!Number.isNaN(maxP)){
      result = result.filter(p => p.price <= maxP);
    }

    // rating
    if(filters.minRating){
      result = result.filter(p => p.rating && p.rating.rate >= filters.minRating);
    }

    // sorting
    switch(sortBy){
      case "price-asc":
        result.sort((a,b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a,b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a,b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case "newest":
        // Fake Store doesn't have createdAt — fallback to id descending
        result.sort((a,b) => b.id - a.id);
        break;
      default:
        // relevance / default - keep API order
        break;
    }

    return result;
  }, [allProducts, searchQuery, filters, sortBy]);

  // paging
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  useEffect(() => {
    if(page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const currentPageItems = filteredAndSorted.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      minPrice: "",
      maxPrice: "",
      minRating: 0
    });
    setSortBy("relevance");
    setPage(1);
  };

  if(loading){
    return <div className="text-center pt-40 text-2xl font-bold">Loading products...</div>;
  }

  return (
    <div className="w-full min-h-screen pb-20 bg-gray-200 pt-32">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-center font-bold text-3xl mb-6">More Products</h1>

        {/* Search / Sort Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-1/2">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-600"></i>
              <input
                type="text"
                placeholder="Search products, categories, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-3 rounded-md border border-gray-300"
              />
            </div>
            <button type="submit" className="bg-black text-white cursor-pointer px-4 py-2 rounded-md">Search</button>
          </form>

          <div className="flex items-center gap-4 justify-end w-full md:w-auto mt-2 md:mt-0">
            <SortDropdown sortBy={sortBy} setSortBy={(val) => { setSortBy(val); setPage(1); }} />
            <button
              onClick={handleClearFilters}
              className="text-sm px-3 py-2 border rounded-md bg-white cursor-pointer hover:bg-gray-100"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {/* Filters column */}
          <aside className="md:col-span-1 hidden md:block">
            <ProductFilters
              categories={categories}
              filters={filters}
              onChange={handleFilterChange}
            />
          </aside>

          {/* Products grid */}
          <section className="md:col-span-3">
            {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

            {filteredAndSorted.length === 0 ? (
              <div className="text-center text-xl py-20">No products match your filters.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20 w-5/6 mx-auto">
                  {currentPageItems.map(product => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-gray-600">
                    Showing {(page-1)*PAGE_SIZE + 1} - {Math.min(page*PAGE_SIZE, filteredAndSorted.length)} of {filteredAndSorted.length}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p)=>Math.max(1,p-1))}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage((p)=>Math.min(totalPages,p+1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Mobile filters as collapsible section */}
        <div className="md:hidden mt-6">
          <details className="bg-white p-4 rounded-md shadow">
            <summary className="font-semibold cursor-pointer">Filters</summary>
            <div className="mt-4">
              <ProductFilters categories={categories} filters={filters} onChange={handleFilterChange} />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
