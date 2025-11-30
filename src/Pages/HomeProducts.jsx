import { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import { getLatestProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

function HomeProducts(){
    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    

     useEffect(() => {
        Aos.refresh();
        }, []);

    useEffect(() => {
        const loadLatestProducts = async () => {
            try{
                const latestProducts = await getLatestProducts();
                setAllProducts(latestProducts);
                setProducts(latestProducts);
            }catch(error){
                console.log(error)
                setError("Failed to load products...");
            }finally{
                setLoading(false)
            }
        }
        loadLatestProducts();
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
        
        <div className="w-full min-h-screen pb-20 bg-zinc-950" data-aos="fade-up">
            
            <div className="pt-40">
                <h1 
                className="
                text-center
                font-bold 
                mt-20
                text-white
                text-3xl">Our Latest Products</h1>

                <form onSubmit={handleSearch} className="search-form mt-10 px-5 flex justify-center w-full md:w-1/2 items-center my-0 mx-auto gap-1 ">
                    <div className="relative  flex-1
                    "><i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-600"></i>
                    <input 
                    type="text" 
                    placeholder="Search for our latest products.... "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-3 text-white rounded-md border border-gray-300 
                    "/>
                    </div>
                    <button type="submit" className="search-button bg-white text-black cursor-pointer px-4 py-2 rounded-md">Search</button>
                </form>

                {error && <div className="error-message text-center text-red-500 font-bold text-2xl pt-20">{error}</div>}

                {loading ? (
                    <div className="loading text-center font-bold text-2xl pt-20">Loading...</div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-5/6 mx-auto">
                        {products.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {products.length > 8 && (
                        <div className="text-center mt-2">
                            <button 
                            onClick={() => navigate('/products')}
                            className="mt-3 px-10 py-2 bg-white text-black rounded-md text-lg cursor-pointer shadow-lg  transition-all ease-in-out hover:bg-gray-400 ">
                                Shop Now
                            </button>
                        </div>
                    )}
                    </div>

                    


                )}
                
            </div>

        </div>
    );
}

export default HomeProducts;