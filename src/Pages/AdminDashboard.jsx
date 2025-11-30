// Pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; 

function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch products
      const productsSnapshot = await getDocs(collection(db, "products"));
      setProductsCount(productsSnapshot.size);

      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      setOrdersCount(ordersSnapshot.size);

      // Calculate total sales
      let sales = 0;
      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        sales += order.total || 0;
      });
      setTotalSales(sales);
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-3xl font-bold mt-2">{productsCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-3xl font-bold mt-2">{ordersCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-3xl font-bold mt-2">${totalSales.toFixed(2)}</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
