import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function OrderConfirmation(){
    const location = useLocation();
    const orderData = location.state || {};

    const customerName = orderData.customer?.name || 'Valued Customer';
    const fakeOrderId = 'ORD-' + Math.floor(Math.random() * 90000000 + 10000000);

    return (
        <div className="min-h-screen pt-32 pb-10 bg-gray-50 flex flex-col items-center">
            <div className="bg-white p-10 md:p-16 rounded-xl shadow-2xl max-w-2xl w-full text-center border-t-8 border-indigo-600">
                <i className="fa-solid fa-circle-check text-6xl text-green-500 mb-6"></i>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    Order Confirmed!
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                    Thank you for your order, **{customerName}**!
                </p>

                <div className="bg-green-50 p-6 rounded-lg mb-8 border border-green-200">
                    <p className="text-lg font-semibold text-green-800">Your Order ID is:</p>
                    <p className="text-4xl font-bold text-green-900 mt-1">{fakeOrderId}</p>
                </div>

                <p className="text-gray-600 mb-10">
                    We'll send a confirmation email to your address shortly. This simulated order has been saved.
                </p>

                <Link 
                    to="/" 
                    className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02]"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );

}

export default OrderConfirmation;