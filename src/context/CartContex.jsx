import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// not needed when using backend api and will need to import useCallback and useMeme from react and apiService.js file will replace all these 3 imports after u import it
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, addDoc, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const localFallbackConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

console.log("API Key from env:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("Full config:", localFallbackConfig);

//------ added for the fire base, with backend this is no longer needed

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : localFallbackConfig.projectId || 'default-app-id';

let config;
if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    config = JSON.parse(__firebase_config);
} else {
    config = localFallbackConfig;
}

const firebaseConfig = config;

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// stops here

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context){
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null); 

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // If using a custom backend, you would keep:
    // const [cartItems, setCartItems] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // 
    // You would replace the userId/isAuthReady with state tracking the JWT/Session status:
    // const [userToken, setUserToken] = useState(null);
    // const [isSessionValid, setIsSessionValid] = useState(false);

    const logOut = async () => {
        try{
            await signOut(auth);
            setIsLoggedIn(false);
            setUserName(null);
            setUserId(null);
            setUserEmail(null);
            setUserAvatar(null);
            console.log("User successfully logged out");
            setError(null);
        }catch(e){
            console.error("Logout failed:", e);
            setError("Failed to logout. Please try again ");
            throw e;
        }
    };
    
    const CART_DOC_PATH = useMemo(() => 
        userId ? `/artifacts/${appId}/users/${userId}/cartData/currentCart` : null,
        [userId]
    );
    // If using a custom backend, this path is not needed. The cart actions 
    // will just call: await apiService.updateCart(userId, newCartData);
    /*const uniqueIdentifier = useMemo(() => 
        userToken || localStorage.getItem('guestId') || crypto.randomUUID(),
        [userToken]
        );
    useEffect(() => {
    // We only fetch data if we have an ID to send to the server
        if (uniqueIdentifier) {
            
            const fetchCartData = async () => {
                setLoading(true);
                setError(null);
                
                try {
                    
                    const cartData = await apiService.getCart(uniqueIdentifier);
                    
                    // If it was a new guest, save their ID for next time
                    if (!userToken && !localStorage.getItem('guestId')) {
                        localStorage.setItem('guestId', uniqueIdentifier);
                    }

                    setCartItems(cartData || []);
                    
                } catch (error) {
                    console.error("Failed to fetch cart:", error);
                    setError("Could not load cart data from server.");
                } finally {
                    setLoading(false);
                }
            };

            fetchCartData();
        }
        
        // Dependencies: Run whenever the identifier changes
    }, [uniqueIdentifier]); 
    // NOTE: isAuthReady/setIsAuthReady is not needed with a simple API key structure.
    */

    const saveCartToFirestore = async (newCartItems) => {
        if (!userId || !CART_DOC_PATH) return;

        const cartDocRef = doc(db, CART_DOC_PATH);

        try{
            // Use setDoc to overwrite the cart data with the new state
            await setDoc(cartDocRef, {
                items: newCartItems,
                lastUpdated: new Date()
            });
            console.log("Cart saved successfully to Firestore");
            setError(null);
        }catch(e){
            console.error("Failed to save cart to Firestore:", e);
            setError("Failed to save cart. Check your network connection or security rules.");
        }
    };

    useEffect(() => {
        const handleAuth = async (user) => {
            let currentUserId = user ? user.uid : null;
            let currentUserName = user ? user.displayName : null;
            let currentIsLoggedIn = user ? !user.isAnonymous : false;
            let currentUserEmail = user ? user.email : null;
            let currentUserAvatar = null;

            if(!currentUserId){
                try{
                    if(initialAuthToken){
                        const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                        currentUserId = userCredential.user.uid;
                        currentIsLoggedIn = true;
                        currentUserEmail = userCredential.user.email;
                        currentUserName = userCredential.user.displayName;
                    }else{
                        const userCredential = await signInAnonymously(auth);
                        currentUserId = userCredential.user.uid;
                        currentIsLoggedIn = false;
                        currentUserEmail = userCredential.user.email;
                        currentUserName = userCredential.user.displayName;
                    }
                }catch(e){
                    console.error("Authentication failed.", e);
                    setError("Failed to secure user ID for cart storage.");
                    setLoading(false);
                    return;
                }
            }

            if (currentUserId && currentIsLoggedIn) {
                try {
                    const userDocRef = doc(db, `artifacts/${appId}/public/data/userProfiles/${currentUserId}`);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const profileData = userDoc.data();
                        currentUserAvatar = profileData.avatar;
                        currentUserName = profileData.name || currentUserName;
                        console.log("User profile loaded from Firestore:", profileData);
                    } else {
                        // Fallback: Create avatar from username or email
                        currentUserAvatar = currentUserName 
                            ? currentUserName.charAt(0).toUpperCase() 
                            : currentUserEmail?.charAt(0).toUpperCase() || '?';
                    }
                } catch (e) {
                    console.error("Failed to fetch user profile:", e);
                    // Fallback avatar
                    currentUserAvatar = currentUserName 
                        ? currentUserName.charAt(0).toUpperCase() 
                        : currentUserEmail?.charAt(0).toUpperCase() || '?';
                }
            }

            setUserId(currentUserId);
            setUserName(currentUserName);
            setUserEmail(currentUserEmail);
            setIsLoggedIn(currentIsLoggedIn);
            setIsAuthReady(true);
        };

        const unsubscribeAuth = onAuthStateChanged(auth, handleAuth);
        return () => unsubscribeAuth(); 
    }, []);

    // BACKEND READY COMMENT:
    // This entire block (useEffect with onAuthStateChanged) is DELETED.
    // 
    // It is replaced by logic that checks for a locally stored JWT or session ID 
    // to determine identity, as shown in the previous example:
    // 
    // useEffect(() => {
    //     const token = localStorage.getItem('userToken');
    //     if (token) {
    //         // Validate token against backend API
    //         apiService.validateToken(token).then(data => {
    //             setUserId(data.userId); 
    //             setIsAuthReady(true);
    //         });
    //     } else {
    //         // Set anonymous ID (using crypto.randomUUID) if no token
    //         setUserId(crypto.randomUUID()); 
    //         setIsAuthReady(true);
    //     }
    // }, []);

    useEffect(() => {
        let unsubscribe = () => {};
        if(isAuthReady && CART_DOC_PATH){
            setLoading(true);
            setError(null);

            const docRef = doc(db, CART_DOC_PATH);

            unsubscribe = onSnapshot(docRef, 
                (docSnapshot) => {
                    if(docSnapshot.exists()){
                        const savedCart = docSnapshot.data().items;

                        setCartItems(savedCart || []);
                        console.log("Cart data loaded successfully form fire store");
                    }else{
                        setCartItems([]);
                        console.log("Cart document does not exist yet in Firestore");
                    }
                    setLoading(false);
                },
                (listenerError) => {
                    console.error("Firestore Listener failed:", listenerError);
                    setError("Lost connection to cart storage, Please check security rules");
                    setLoading(false);
                }
            );
        } 
        return() => {
            unsubscribe();
            setLoading(false);
        };
    }, [isAuthReady, CART_DOC_PATH]);

    // BACKEND READY COMMENT:
    // This entire block (useEffect with onSnapshot) is DELETED.
    // 
    // It is replaced by the async data fetching function we discussed previously:
    // useEffect(() => {
    //     if (uniqueIdentifier) {
    //         const fetchCartData = async () => { ... (The async try/catch/finally block) ... }
    //         fetchCartData();
    //     }
    // }, [uniqueIdentifier]); 
    // 
    // Note: The custom backend requires manual saving after every local change (Part 5).
    // Firestore handles real-time syncing automatically (as done here)

    

    /* for the custom backend code
    const saveCartToBackend = useCallback(async (newCartItems) => {
    if (!uniqueIdentifier) return; // Guard
    
    // NOTE: This assumes 'uniqueIdentifier' and 'apiService' are available.
    try {
        await apiService.updateCart(uniqueIdentifier, newCartItems);
        // The server confirms the save, so we don't need to do anything else.
    } catch (error) {
        console.error("Backend Error: Failed to save cart.", error);
        // You may want to set an error state here.
    }
    }, [uniqueIdentifier]); // Only redefine if the ID changes
    */

    useEffect(() => {
        console.log("Cart updated:", cartItems)
    }, [cartItems]);

    const addToCart = async (product) => {
        let newCart;
        const existingItem = cartItems.find(item => item.id === product.id);

        if(existingItem){
            newCart = cartItems.map(item => (
                    item.id === product.id
                    ? {...item, quantity: item.quantity + 1}
                    : item 
                )
            );
        }else{
           newCart = [
                ...cartItems,
                {...product, quantity: 1}
            ];
        }
        console.log("Adding product:", product.title);
        await saveCartToFirestore(newCart);
    };
    /*
    // FUTURE BACKEND-READY IMPLEMENTATION OF addToCart:
    const addToCart = async (product) => { // <-- MUST be async now
        // 1. Calculate the NEW local state (exactly like you do now)
        let newCart;
        const existingItem = cartItems.find(item => item.id === product.id);

        if(existingItem){
            newCart = cartItems.map(item => 
                item.id === product.id
                ? {...item, quantity: item.quantity + 1}
                : item 
            );
        } else {
            newCart = [...cartItems, {...product, quantity: 1}];
        }
        
        // 2. Optimistic Local Update
        setCartItems(newCart);
        
        // 3. Persist the change to the server
        await saveCartToBackend(newCart); // <-- Call the new async save function

        console.log("Adding product and requesting save:", product.title);
    };
    */

    const increaseQuantity = async (productId) => {
        const newCart = cartItems.map(item => 
            item.id === productId
            ? {...item, quantity: item.quantity + 1}
            : item
        );
        await saveCartToFirestore(newCart);
    };
    const decreaseQuantity = async (productId) => {
        const newCart = cartItems.map(item => 
            item.id === productId
            ? item.quantity > 1
                ? {...item, quantity: item.quantity - 1}
                : item
            : item
        ).filter(item => item.quantity > 0); // Ensure items with quantity 0 are filtered out 
        
        await saveCartToFirestore(newCart);
    };

    const removeItem = async (productId) => {
        const newCart = cartItems.filter(item => item.id !== productId);
        console.log("Removed product:", productId);
        await saveCartToFirestore(newCart);
    };



    /*// FUTURE BACKEND-READY IMPLEMENTATION:
    const clearCart = async () => {
        try {
            // 1. Update the backend/server via the API service
            await apiService.clearCart(uniqueIdentifier); // <--- We use 'await' here
            
            // 2. ONLY if the server call is successful, update the local state
            setCartItems([]);
            console.log("Backend and local cart cleared.");
            
        } catch (error) {
            // 3. Handle errors (e.g., server offline, bad token)
            console.error("Failed to clear cart on server:", error);
            setError("Could not clear cart. Please try again.");
        }
    }; */
    const clearCart = async () => {
        console.log("Cart cleared")
        await saveCartToFirestore([]);
    };

    const placeOrder = async (customerInfo) => {
        if(!userId || cartItems.length === 0){
            throw new Error("Cannot place order without items or authenticated user.");
        }

        const ORDER_COLLECTION_PATH = `/artifacts/${appId}/users/${userId}/orderHistory`;
        const orderData = {
            customerInfo: customerInfo,
            items: cartItems,
            total: cartTotal,
            orderDate: serverTimestamp(), // Use server timestamp for accurate ordering
            status: 'Processing',
            shippingAddress: `${customerInfo.address}, ${customerInfo.city} ${customerInfo.zip}`
        };

        try {
            // 1. Save the new order document to the orderHistory collection
            await addDoc(collection(db, ORDER_COLLECTION_PATH), orderData);
            console.log("Order saved successfully to history.");

            // 2. Clear the cart
            await clearCart(); 
            return true;
        } catch (e) {
            console.error("Error placing order:", e);
            setError("Failed to place order. Check network or Firestore security rules.");
            throw new Error("Order placement failed.");
        }
    }

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const value = {
        cartItems,
        addToCart,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        totalItems,
        cartTotal,
        clearCart,
        placeOrder,
        userAvatar,
        userName,
        userEmail,
        loading,
        error,
        userId,
        isAuthReady,
        logOut,
        db,
        appId,
        isLoggedIn,
    };
    /*
    // BACKEND READY COMMENT:
    // This value object remains almost the same, but you would replace:
    // - loading/error: These would be managed the same way.
    // - userId: This would be the 'userToken' or 'uniqueIdentifier' (for display/debugging).
    // - isAuthReady: This would be 'isSessionValid'.
    */

    return(
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}










/*
How backend code will look like---------------------------------------------------------------------------------------------------------------------------------------------------------
// NOTE: This code block shows the REPLACEMENTS for the existing synchronous functions 
// in your CartProvider when moving to a custom backend and using the 
// 'saveCartToBackend' function defined earlier.

// --- 1. The Core Save Function (Requires: uniqueIdentifier) ---
const saveCartToBackend = useCallback(async (newCartItems) => {
    if (!uniqueIdentifier) return; 
    
    try {
        // This is your external API call
        await apiService.updateCart(uniqueIdentifier, newCartItems);
        setError(null);
    } catch (error) {
        console.error("Backend Error: Failed to save cart.", error);
        setError("Failed to save cart to server. Please check your connection.");
    }
}, [uniqueIdentifier]); 

// --- 2. Replacement for addToCart (Async) ---
const addToCart = async (product) => {
    let newCart;
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        newCart = cartItems.map(item => 
            item.id === product.id ? {...item, quantity: item.quantity + 1} : item 
        );
    } else {
        newCart = [...cartItems, {...product, quantity: 1}];
    }
    
    // 1. Optimistic Local Update
    setCartItems(newCart);
    
    // 2. Persist the change to the server
    await saveCartToBackend(newCart); 
};


// --- 3. Replacement for increaseQuantity (Async) ---
const increaseQuantity = async (productId) => {
    // Calculate the new state
    const newCart = cartItems.map(item => 
        item.id === productId
        ? {...item, quantity: item.quantity + 1}
        : item
    );

    // 1. Optimistic Local Update
    setCartItems(newCart);

    // 2. Persist the change to the server
    await saveCartToBackend(newCart);
};

// --- 4. Replacement for decreaseQuantity (Async) ---
const decreaseQuantity = async (productId) => {
    // Calculate the new state
    const newCart = cartItems.map(item => 
        item.id === productId
        ? item.quantity > 1
            ? {...item, quantity: item.quantity - 1}
            : item // Don't allow quantity < 1
        : item 
    );
    
    // 1. Optimistic Local Update
    setCartItems(newCart);

    // 2. Persist the change to the server
    await saveCartToBackend(newCart);
};

// --- 5. Replacement for removeItem (Async) ---
const removeItem = async (productId) => {
    // Calculate the new state
    const newCart = cartItems.filter(item => item.id !== productId);
    
    // 1. Optimistic Local Update
    setCartItems(newCart);

    // 2. Persist the change to the server
    await saveCartToBackend(newCart);
};

// --- 6. Replacement for clearCart (Async, requires a specific API endpoint) ---
const clearCart = async () => {
    try {
        // 1. Update the backend/server via the API service
        await apiService.clearCart(uniqueIdentifier); // <--- Requires a CLEAR endpoint
        
        // 2. ONLY if the server call is successful, update the local state
        setCartItems([]);
        setError(null);
        console.log("Backend and local cart cleared.");
        
    } catch (error) {
        // 3. Handle errors
        console.error("Failed to clear cart on server:", error);
        setError("Could not clear cart. Please try again.");
    }
};
*/