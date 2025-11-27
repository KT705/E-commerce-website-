import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

//export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
    ? JSON.parse(__firebase_config)
    : {};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);


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

        const userDocRef = doc(db, `artifacts/${appId}/public/data/userProfiles/${user.uid}`);
        await setDoc(userDocRef, {
            name: username,
            email: email,
            userId: user.id,
            createdAt: new Date() 
        });
        return user;

    }catch(error){
        throw new Error(error.code || "An unexpected error occurred during sign up.");
    }
};

export const signIn = async (email, passsword) => {
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, passsword);
        return userCredential.user;
    }catch(error){
        throw new Error(error.code || "An unexpected error occured during signIn");
    }
};

export const logOut = async () => {
    try{
        await signOut(auth);
    }catch(error){
        console.error("Error during sign out:", error);
        throw new Error(error.code || "An unexpected error occurred during sign out");
    }
};
