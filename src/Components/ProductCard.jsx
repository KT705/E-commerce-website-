import { useCart } from "../context/CartContex";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import React from "react";

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
        <div className="bg-zinc-500 pb-2 mb-20 h-80 w-64 flex flex-col justify-between rounded-lg">
            <div className="flex justify-center">
                <img src={product.image} alt={product.title} 
                className="w-28 h-40 pt-3 drop-shadow-xl/50"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/4f46e5/ffffff?text=No+Image" }}
                />
            </div>
            <div className="pb-2 px-2">
                
                <h3 className="text-sm">{product.title}</h3>
                <h4 className="pb-3">${product.price}</h4>
                <button
                onClick={handleAddToCart} 
                className={`
                w-full rounded-md text-sm py-1 px-3 cursor-pointer transition duration-200
                ${isInCart 
                    ? 'bg-green-600 hover:bg-green-800 text-white font-bold'
                    : 'bg-white hover:bg-slate-400 text-gray-800 font-semibold'}
                `}
                >{isInCart ? 'Added to Cart' : 'Add to Cart'} </button>
            </div>
        </div>
    );
}
export default ProductCard;