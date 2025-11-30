import { useCart } from "../context/CartContex";
import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Cart(){
    const {cartItems, cartTotal, increaseQuantity,
        decreaseQuantity, removeItem
    } = useCart();

    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    return(
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12">
            {cartItems.length === 0 ? (
                <div className="mt-20 text-center flex justify-center items-center flex-col my-0 mx-auto py-20 bg-gray-950 rounded-xl w-1/2 shadow-2xl">
                    <p className="text-sm text-white mb-4 md:text-2xl">Your cart is empty</p>
                    <Link to="/" className="inline-block px-6 py-4 bg-zinc-800 text-white font-bold rounded-lg">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row mt-20 gap-8">
                    <h1 className="font-bold">Your Cart</h1>

                    <div className="flex-1 lg:w-2/3 bg-white p-6 rounded-xl shadow-lg ">
                        <div className="divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <div key={item.id} className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-2/5">
                                        <img 
                                        src={item.image || "https://placehold.co/60x60/cccccc/333333?text=N/A"} 
                                        alt={item.title} 
                                        className="w-16 h-16 object-cover rounded-md shadow-md"
                                        />
                                        <div>
                                            <h3 className="text-md font-semibold text-gray-900">{item.title}</h3>
                                            <p className="text-sm text-gray-800">Price: {formatCurrency(item.price)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-3/5">

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer transition-colors text-lg font-bold disabled::opacity-50"
                                                disabled={item.quantity === 1}
                                            >-</button>
                                            <span className="font-bold w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="px-3 py-1 bg-gray-200 cursor-pointer rounded-full hover:bg-gray-300 transition-colors text-lg font-bold disabled::opacity-50"
                                            >+</button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-800 cursor-pointer transition-colors p-2"
                                        ><i className="fa-solid fa-trash-can text-sm"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/3 h-fit bg-white p-6 rounded-xl shadow-lg sticky top-28">
                        <h2 className="text-xl font-bold mb-3 border-b pb-2">Oder Summary</h2>
                        <div className="flex justify-between text-md mb-2">
                            <span>SubTotal:</span>
                            <span className="font-bold">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-300">
                            <span>Total:</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <button onClick={handleCheckout}
                        className="w-1/2 mt-6 py-3 bg-gray-900 text-white cursor-pointer font-semibold rounded-lg shadow-md hover:bg-gray-800 hover:text-gray-200 transition duration-300">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;