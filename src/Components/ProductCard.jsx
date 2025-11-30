import { useCart } from "../context/CartContex";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Link } from "react-router-dom";


function ProductCard({product}){
    const {addToCart, cartItems, isLoggedIn, userId } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = async () => {

        if(!isLoggedIn){
            console.log("User not authenticated, redirecting to login");
            navigate('/auth');
            return;
        }
        await addToCart(product);
        console.log(`Product ${product.name} added to cart by user ${userId}`);
    };

    const isInCart = cartItems.some(item => item.id === product.id);

    return(
        <div className="bg-zinc-50 pb-2 mb-20 h-80  flex flex-col justify-between rounded-lg  transform transition-transform duration-300 hover:-translate-y-3">
            <div className="flex justify-center">
                <Link to={`/products/${product.id}`}>
                <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-40 object-contain pt-3 drop-shadow-xl/50"
                    
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/4f46e5/ffffff?text=No+Image" }}
                />
                </Link>
 
                
                
            </div>
            <div className="pb-2 px-2">
                
                <Link to={`/products/${product.id}`}>
                    <h3 className="text-sm text-black">{product.title}</h3>
                </Link>

                <h4 className="pb-3 text-black">${product.price}</h4>
                <button
                onClick={handleAddToCart} 
                className={`
                w-full rounded-md text-sm py-1 px-3 cursor-pointer transition duration-200
                ${isInCart 
                    ? 'bg-green-600 hover:bg-green-800 text-white font-bold'
                    : 'bg-black hover:bg-gray-900 text-white font-semibold'}
                `}
                >{isInCart ? 'Added to Cart' : 'Add to Cart'} </button>
            </div>
        </div>
    );
}
export default ProductCard;