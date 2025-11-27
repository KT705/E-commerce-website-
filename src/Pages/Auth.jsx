import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, auth, db, appId } from '../firebase/firebase';

const Auth = () => {
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const errorMap = {
        'auth/invalid-email': 'The email address is badly formatted. Please check your email.',
        'auth/user-disabled': 'This user account has been disabled.',
        'auth/user-not-found': 'No account found with this email. Please sign up or check your details.',
        'auth/wrong-password': 'The password you entered is incorrect.',
        'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
        'auth/weak-password': 'The password must be at least 6 characters long.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. (Admin setting issue).',
        'auth/too-many-requests': 'Access temporarily blocked due to too many failed attempts. Try again later.',
        'auth/requires-recent-login': 'Please log out and log in again to perform this action.',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            if(isLoginView){
                await signIn(email, password)
            }else{
                await signUp(email, password, username);
            }

            navigate('/');
        }catch(err){
            const errorCode = err.message || 'auth/unknown-error';
            const friendlyMessage = errorMap[errorCode] || 'An unexpected error occurred. Please try again.';

            console.error("Auth Error:", errorCode, friendlyMessage);
            setError(friendlyMessage);
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 pt-20">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    {isLoginView ? 'Sign In' : 'Create Account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        {!isLoginView && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500"
                                placeholder="Your Display Name"
                            />
                        </div>
                    )}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Min. 6 characters"
                        />
                        {!isLoginView && (
                            <p className="mt-2 text-xs text-gray-500">
                                Password must be at least 6 characters long for registration.
                            </p>
                        )}
                    </div>
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white transition duration-300 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.01]'}`}
                    >
                        {loading ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i> // Loading Spinner
                        ) : (
                            isLoginView ? 'Sign In' : 'Sign Up'
                        )}
                    </button>

                    {/* Switch View Link */}
                    <p className="text-center text-sm text-gray-600">
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginView(!isLoginView);
                                setError(null); // Clear errors when switching views
                                setEmail('');
                                setUsername('') // Clear inputs when switching
                                setPassword('');
                            }}
                            className="font-semibold text-black hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
                        >
                            {isLoginView ? 'Sign Up Now' : 'Sign In'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Auth;