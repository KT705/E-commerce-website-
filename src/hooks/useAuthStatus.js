import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
//import { doc, getDoc } from 'firebase/firestore';
import { auth, db, appId } from '../firebase/firebase.js';

export const useAuthStatus = () => {
    const [currentUser, setCurrentUser] = useState(null);
    //const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
            
           /* if (user) {
                // Fetch user profile from Firestore
                try {
                    const userDocRef = doc(db, `artifacts/${appId}/public/data/userProfiles/${user.uid}`);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    } else {
                        // Fallback: create avatar from email if profile doesn't exist yet
                        setUserProfile({
                            avatar: user.email?.charAt(0).toUpperCase() || '?',
                            name: user.displayName || 'User',
                            email: user.email
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Fallback on error
                    setUserProfile({
                        avatar: user.email?.charAt(0).toUpperCase() || '?',
                        name: user.displayName || 'User',
                        email: user.email
                    });
                }
            } else {
                setUserProfile(null);
            }
            
            setLoading(false);*/
        });

        return unsubscribe;
    }, []);

    return { currentUser, /*userProfile*/ loading };
};