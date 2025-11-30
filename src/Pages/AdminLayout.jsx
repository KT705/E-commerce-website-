import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../Components/Navbar";
import { appId } from "../firebase/firebase";

function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        console.log("No user logged in. Redirecting to login...");
        navigate("/auth");
        return;
      }

      try {
        const uid = auth.currentUser.uid;
        console.log("Current user UID:", uid);

        const userRef = doc(db, `artifacts/${appId}/admins/${auth.currentUser.uid}`); 
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("No user document found for this UID. Redirecting home...");
          navigate("/");
          return;
        }

        const userData = userSnap.data();
        console.log("User data:", userData);

        if (userData.isAdmin === true) {
          console.log("Admin access granted.");
          setIsAdmin(true);
        } else {
          console.log("User is not admin. Redirecting home...");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-blue-700">
        Checking admin access...
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <div>
          <Navbar />
          <div className="min-h-screen pt-20">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLayout;
