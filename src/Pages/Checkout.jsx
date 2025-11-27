import React, { useState } from 'react';
import { useCart } from '../context/CartContex.jsx';
import { useNavigate, Link } from 'react-router-dom';

function Checkout(){
    const {cartTotal, clearCart, placeOrder, cartItems} = useCart();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // when working with a backend api use this line of code and remember to put async at the top and move the clear cart functtion and navigate inside the try block before the catch error
       {/* const orderData = {
            customerInfo: formData,
            items: cartItems,
            total: cartTotal,
        };

        try{
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if(!response.ok){
                throw new Error('Order submission failed on the server side.');
            }

            const result = await response.json();
            const orderId = result.orderId; 

            
        }catch(error){
            console.error("Order submission error:", error);
        }
        */}

        if (cartItems.length === 0) {
            setOrderError("Your cart is empty. Please add items before checking out.");
            return;
        }
        
        setProcessing(true);
        setOrderError(null);

        try {
            // Call the new context function which saves the order to history AND clears the cart
            await placeOrder(formData);
            clearCart();

            // Navigate on successful order placement
            navigate('/confirmation', { state: { orderPlaced: true, customer: formData} });
        } catch (error) {
            console.error("Order submission error:", error);
            setOrderError("There was an issue processing your order. Please try again.");
            setProcessing(false);
        }
        
        
    }

    return (
        <div className="min-h-screen pt-24 pb-10 bg-gray-50 flex justify-center">
            <div className="max-w-6xl w-full p-4 lg:p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                    Secure Checkout
                </h1>

                {cartTotal === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-8">
                        <p className="text-2xl text-gray-600 font-semibold">Your cart is empty. Please add items to checkout.</p>
                        <Link to="/products" className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-indigo-700 transition">
                            Go to Products
                        </Link>
                    </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-semibold mb-6 text-black border-b pb-3">Shipping Information</h2>
                            
                            {/* Full Name Input */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:border-black focus:ring-black"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:border-black focus:ring-black"
                                />
                            </div>

                            {/* Address Input */}
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:border-black focus:ring-black"
                                />
                            </div>

                            {/* City and Zip Row */}
                            <div className="flex space-x-4 mb-6">
                                {/* City Input */}
                                <div className="flex-1">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:border-black focus:ring-black"
                                    />
                                </div>
                                {/* Zip Input */}
                                <div className="flex-1">
                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip Code</label>
                                    <input
                                        type="text"
                                        id="zip"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:border-black focus:ring-black"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/3 h-fit bg-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-200 sticky top-28">
                            <h2 className="text-2xl font-semibold mb-4 text-black border-b pb-3">Order Summary</h2>

                            <div className="flex justify-between text-lg mb-2 text-gray-700">
                                <span>Subtotal:</span>
                                <span className="font-medium">${cartTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-lg mb-4 text-gray-700">
                                <span>Shipping:</span>
                                <span className="font-medium">FREE</span>
                            </div>
                            
                            <div className="flex justify-between text-3xl font-bold pt-4 border-t border-indigo-300">
                                <span>Order Total:</span>
                                <span className="text-black">${cartTotal.toFixed(2)}</span>
                            </div>

                            {/* Payment Method Placeholder */}
                            <div className="mt-6 mb-6 p-4 bg-white rounded-md border border-gray-200">
                                <h3 className="text-md font-semibold mb-2">Payment Method</h3>
                                <p className="text-sm text-gray-500">
                                    
                                </p>
                                <div className="mt-2 text-sm">
                                    <i className="fa-regular fa-credit-card mr-2 text-black"></i>
                                    Credit Card
                                </div>
                            </div>
                            
                            {/* The Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-4 bg-black text-white font-bold text-lg rounded-xl shadow-md hover:bg-black transition duration-300"
                            >
                                Place Order (Pay ${cartTotal.toFixed(2)})
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );

}

export default Checkout;