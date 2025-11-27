import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContex';
import { collection, query, where, getDocs } from 'firebase/firestore'; // New Firestore imports
import { Clock } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const { userId, db, appId, isAuthReady, isLoggedIn } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    
    const ORDERS_COLLECTION_PATH = userId 
        ? `/artifacts/${appId}/users/${userId}/orderHistory` 
        : null;

    useEffect(() => {
        if (!isAuthReady || !userId || !ORDERS_COLLECTION_PATH) {
            if (!isAuthReady) return;
            
            if (!userId) {
                setLoading(false);
                setError("Please log in to view your order history.");
            }
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                
                const q = query(collection(db, ORDERS_COLLECTION_PATH));
                const querySnapshot = await getDocs(q);

                const fetchedOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    
                    orderDate: doc.data().orderDate?.toDate ? doc.data().orderDate.toDate() : new Date() 
                }));

                
                fetchedOrders.sort((a, b) => b.orderDate - a.orderDate);

                setOrders(fetchedOrders);
                console.log("Fetched orders:", fetchedOrders.length);

            } catch (e) {
                console.error("Error fetching order history:", e);
                setError("Failed to load order history. Check network or security rules.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        
        
    }, [isAuthReady, userId, db, ORDERS_COLLECTION_PATH]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-50">
                <div className="text-gray-500 text-xl font-medium">
                    <i className="fas fa-spinner fa-spin mr-3"></i>Loading Orders...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-50">
                <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg max-w-lg text-center">
                    <h3 className="text-xl font-bold mb-2">Error Loading History</h3>
                    <p>{error}</p>
                    {!isLoggedIn && (
                        <p className="mt-4 text-sm">If you don't have an account, please sign up or log in to view your personalized history.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 p-4 sm:p-8">
            <header className="mb-8 mt-20 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center sm:justify-start">
                    <Clock className="w-8 h-8 mr-3 text-black" />
                    Order History
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Review your past purchases. You have <span className="font-semibold text-black">{orders.length}</span> order{orders.length !== 1 ? 's' : ''} on record.
                </p>
            </header>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl shadow-xl text-center border-2 border-dashed border-gray-300">
                        <p className="text-xl font-semibold text-gray-700">No Orders Found</p>
                        <p className="mt-2 mb-2 text-gray-500">Looks like you haven't placed any orders yet. Visit the shop to get started!</p>
                        <button
                        onClick={() => navigate('/')}
                        className="w-full md:w-auto mt-3 md:mt-0 md:ml-4 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150"
                        >start shopping</button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                            <div className="flex justify-between items-start border-b pb-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Order ID: <span className="font-mono text-sm text-gray-500 block sm:inline-block">{order.id}</span></h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Date Placed: {order.orderDate.toLocaleDateString()} at {order.orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-extrabold text-black-600">${order.total.toFixed(2)}</p>
                                    <span className="text-xs font-medium text-green-600 bg-green-100 py-1 px-3 rounded-full mt-1 inline-block">
                                        {order.status || 'Completed'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 mb-2">Items Ordered:</h4>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-50 pt-2">
                                        <div className="flex items-center truncate">
                                            <p className="font-medium truncate">{item.title}</p>
                                        </div>
                                        <span className="shrink-0 ml-4">
                                            {item.quantity} x ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-600">Shipping To: {order.shippingAddress || 'Not Provided'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default OrderHistory;