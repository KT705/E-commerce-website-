import React from "react";
import { useCart } from "../context/CartContex";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const { userName, userEmail, userId, isLoggedIn, isAuthReady } = useCart();

    const navigate = useNavigate()

    const profileInitial = userName
        ? userName.charAt(0).toUpperCase()
        : (isLoggedIn ? 'U' : '?');
    
    if(!isAuthReady){
        return(
            <div className="flex items-center justify-center min-h-screen pt-20">
                <p className="text-lg text-blue-900 font-bold">Loading user authentication status...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-20 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-red-600 mb-4">Access Denied</p>
                    <p className="text-gray-600">You must be signed in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 p-4">
            <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">My Profile</h1>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                    
                    <div className="shrink-0">
                        <div 
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-extrabold shadow-lg ring-4 ring-indigo-200"
                            title={userName}
                        >
                            {profileInitial}
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grow">
                        <div className="space-y-4">
                            {/* User Name */}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="text-lg font-semibold text-gray-800">{userName}</p>
                            </div>
                            {/* User Email (Placeholder) */}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">Email Address</p>
                                <p className="text-lg font-semibold text-gray-800">{userEmail}</p>
                            </div>
                            {/* User ID (Read-only/Technical Detail) */}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm wrap-break-word">
                                <p className="text-sm font-medium text-gray-500">User ID (for support)</p>
                                <p className="text-xs font-mono text-gray-700">{userId}</p>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Placeholder for future features */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Account Actions</h2>

                    

                    <button
                        className="w-full md:w-auto mt-3 md:mt-0 md:ml-4 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150"
                        onClick={() => navigate('/history')} 
                    >
                        View Order History
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default ProfilePage;
