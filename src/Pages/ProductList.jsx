import { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import { useCart } from "../context/CartContex";
import { Link } from "react-router-dom";
import { getProducts, authenticateUser } from "../firebase/firebase";

function ProductList(){
    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProductsFromFirebase = async () => {
            try{
                await authenticateUser();

                const firebaseProducts = await getProducts();

                setAllProducts(firebaseProducts);
                setProducts(firebaseProducts);
            }catch(error){
                console.log(error)
                setError("Failed to load products from database");
            }finally{
                setLoading(false)
            }
        }
        loadProductsFromFirebase();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true)

        const query = searchQuery.trim().toLowerCase();

        if(!query){
            setError(null);
            setLoading(false);
            return
        }
        
        const searchResults = allProducts.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        setProducts(searchResults);

        if(searchResults.length === 0){
            setError(`No matching results for "${searchQuery}"`)
        }else{
            setError(null)
        }

        setLoading(false);
    };


    return(
        <div className="w-full min-h-screen pb-20 absolute bg-green-100">
            <div className="pt-40">
                <h1 
                className="
                text-center
                font-bold 
                mt-20
                
                text-3xl">More Products</h1>

                <form onSubmit={handleSearch} className="search-form mt-10 flex justify-center items-center my-0 mx-auto gap-1 ">
                    <div className="relative  md:flex items-center justify-center gap-3
                    "><i className="fa-solid fa-magnifying-glass absolute left-3 text-gray-700 mt-3 md:mt-0"></i>
                    <input 
                    type="text" 
                    placeholder="Search.... "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-1 pr-0 max-w-60 rounded-xl border-2 border-black
                    focus:bg-slate-100 focus:outline-gray-500 md:py-2 pl-20"/>
                    </div>
                    <button type="submit" className="search-button bg-black px-1 text-white rounded-lg cursor-pointer md:px-4 py-2 text-lg">Search</button>
                </form>

                {error && <div className="error-message text-center text-red-600 font-bold text-2xl pt-20">{error}</div>}

                {loading ? (
                    <div className="loading text-center font-bold text-2xl pt-20">Loading...</div>
                    ) : (
                    <div className="flex justify-around mt-20 mx-auto items-center flex-wrap w-5/6 gap-5">
                        {products.map((product) => (
                            <ProductCard product={product} key={product.id}/>
                        ))}
                    </div>
                )}
                
            </div>

        </div>
    );
}

export default ProductList;