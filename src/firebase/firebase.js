import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
    ? JSON.parse(__firebase_config)
    : {};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);


export const authenticateUser = async () => {
    try {
        if (!auth.currentUser) { 
            if (initialAuthToken) {
               
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                
                await signInAnonymously(auth);
            }
            console.log("Firebase Authentication successful. User ID:", auth.currentUser.uid);
        }
    } catch (error) {
        console.error("Firebase Authentication failed:", error);
    }
};


export const PRODUCTS_COLLECTION_PATH = `/artifacts/${appId}/public/data/products`;


export const getProducts = async () => {
    try {
        
        await authenticateUser();

        
        const productsCollection = collection(db, PRODUCTS_COLLECTION_PATH);
        const productSnapshot = await getDocs(productsCollection);
        
        const productList = productSnapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data() 
        }));
        
        console.log("Products fetched successfully:", productList.length);
        return productList;
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        return [];
    }
};

export const signUp = async (email, password, username) => {
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        const avatar = username.charAt(0).toUpperCase();

        const userDocRef = doc(db, `artifacts/${appId}/public/data/userProfiles/${user.uid}`);
        await setDoc(userDocRef, {
            name: username,
            email: email,
            userId: user.uid,
            avatar: avatar,
            createdAt: new Date() 
        });
        return user;

    }catch(error){
        console.error("Sign up error:", error);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }catch(error){
        console.error("Sign in error:", error);
        throw error;
    }
};

export const logOut = async () => {
    try{
        await signOut(auth);
    }catch(error){
        console.error("Error during sign out:", error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const userDocRef = doc(db, `artifacts/${appId}/public/data/userProfiles/${userId}`);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};