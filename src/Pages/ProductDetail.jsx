import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContex";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, isLoggedIn } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isInCart = product && cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    addToCart(product);
  };

 
  const renderStars = (rate) => {
    const stars = Math.round(rate);
    return (
      <div className="flex gap-1 text-yellow-500 text-xl">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < stars ? "★" : "☆"}</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center pt-40 text-2xl font-bold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 pt-40 text-2xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-green-100 pt-32 pb-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl w-11/12 md:w-3/4 p-6 flex flex-col md:flex-row gap-10">

        {/* Left Side - Image */}
        <div className="flex justify-center md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-60 md:w-80 drop-shadow-lg rounded-lg"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x300/4f46e5/ffffff?text=No+Image";
            }}
          />
        </div>

        {/* Right Side - Details */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="text-xl font-semibold text-green-700">
            ${product.price}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            {renderStars(product.rating.rate)}
            <span className="text-gray-600 text-sm">
              ({product.rating.count} reviews)
            </span>
          </div>

          <p className="text-gray-700">{product.description}</p>

          <p className="text-sm text-gray-500">
            Category: <span className="font-semibold capitalize">{product.category}</span>
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`mt-4 w-full py-2 rounded-lg text-white font-bold transition 
            ${isInCart ? "bg-green-600" : "bg-black hover:bg-gray-800"}`}
          >
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 w-full py-2 rounded-lg border border-gray-700 text-gray-700 hover:bg-gray-200 font-semibold"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
