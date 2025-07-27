import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCartItems, getCartItems } from "@/features/CartSlice";
import { AuthContext } from "@/context/AuthContext";
import { API } from "@/api/api";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2, StarIcon, Star, Gift, Truck, RefreshCw, Box } from "lucide-react";

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [recommendedProduct, setRecommendedProduct] = useState();
  const [mainImage, setMainImage] = useState("");
  const [imgZoom, setImgZoom] = useState(false);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const { user } = useContext(AuthContext);
  const { loading } = useSelector((state) => state.cart);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let getProduct = async () => {
      try {
        setLoadingProduct(true);
        let res = await axios.get(`${API.PRODUCTS}/${id}`);
        setProduct(res.data);
        setCategory(res.data.category);
        setMainImage(
          res.data.thumbnail ||
          res.data.images?.[0] ||
          "https://via.placeholder.com/600"
        );
        setLoadingProduct(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    if (!category) return;
    let getRecommendedProducts = async () => {
      try {
        setSkeletonLoading(true);
        let res = await axios.get(`${API.PRODUCTS}/category/${category}`);
        console.log(res.data.products);
        let filteredProducts = res.data.products.filter(
          (product) => product.id !== Number(id)
        )
        setRecommendedProduct(filteredProducts);
        setSkeletonLoading(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    getRecommendedProducts();
  }, [category, id]);

  if (!product || loadingProduct)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  const handleAddToCart = (val) => {
    if (!user || !user.uid || user === "null") {
      toast.error("Please log in to add to cart.");
      return;
    }
    const product = {
      uid: user.uid,
      productId: val.id,
      quantity: 1,
    };
    dispatch(addToCartItems(product)).then(() => {
      dispatch(getCartItems(user.uid));
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-blue-500"
      >
        <ChevronLeft className="w-6 h-6" />
        Go Back
      </button>
      {/* Top section: Hero image + details */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden border shadow group cursor-zoom-in transition">
            <img
              src={mainImage}
              alt={product.title}
              className={`w-full h-[28rem] object-contain bg-white transition duration-300 ${
                imgZoom ? "scale-110" : ""
              }`}
              onClick={() => setImgZoom(!imgZoom)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600";
              }}
            />
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition">
              Click to {imgZoom ? "shrink" : "zoom"}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3 mt-3">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMainImage(img)}
                className={`rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                  mainImage === img
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-200"
                }`}
                tabIndex={0}
                aria-label={`Show image ${i + 1}`}
              >
                <img
                  src={img !== "..." ? img : "https://via.placeholder.com/150"}
                  alt={`${product.title} ${i}`}
                  className="w-full h-20 object-contain bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
            <p className="text-lg text-gray-500">{product.brand}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold text-green-600 tracking-tight">
              ₹{(product.price * 80).toLocaleString("en-IN")}
            </span>
            <Badge
              variant="outline"
              className="text-sm text-yellow-700 border-yellow-400 bg-yellow-50"
            >
              {Math.round(product.discountPercentage)}% OFF
            </Badge>
            <span className="ml-auto font-medium text-gray-700 flex items-center gap-1">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="text-yellow-500"
              >
                <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
              </svg>
              {product.rating}
            </span>
          </div>
          <p className="text-base text-gray-700">{product.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <span className="font-semibold">SKU:</span> {product.sku}
            </div>
            <div>
              <span className="font-semibold">Weight:</span> {product.weight} g
            </div>
            <div>
              <span className="font-semibold">Dimensions:</span>{" "}
              {product.dimensions.width}×{product.dimensions.height}×
              {product.dimensions.depth} mm
            </div>
            <div>
              <span className="font-semibold">Min. Qty:</span>{" "}
              {product.minimumOrderQuantity}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={
                product.availabilityStatus === "Low Stock"
                  ? "destructive"
                  : "outline"
              }
            >
              {product.availabilityStatus}
            </Badge>
            <span className="text-sm text-gray-600">
              {product.stock} in stock
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-base py-6 rounded-lg shadow-lg"
              onClick={() => handleAddToCart(product)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                "Add to Cart"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-100 text-base py-6 rounded-lg shadow"
            >
              Buy Now
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mt-2">
            <div>
              <span className="font-semibold">Warranty:</span>{" "}
              {product.warrantyInformation}
            </div>
            <div>
              <span className="font-semibold">Shipping:</span>{" "}
              {product.shippingInformation}
            </div>
            <div>
              <span className="font-semibold">Return Policy:</span>{" "}
              {product.returnPolicy}
            </div>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* 🖼️ Image Gallery */}
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden border shadow-lg group cursor-zoom-in transition">
            <img
              src={mainImage}
              alt={product.title}
              className={`w-full h-[28rem] object-contain bg-white transition duration-300 ${imgZoom ? "scale-110" : ""}`}
              onClick={() => setImgZoom(!imgZoom)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600";
              }}
            />
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition">
              Click to {imgZoom ? "shrink" : "zoom"}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3 mt-3">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMainImage(img)}
                className={`rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none ${mainImage === img ? "border-blue-600 shadow-lg" : "border-gray-200"
                  }`}
                aria-label={`Show image ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.title} ${i}`}
                  className="w-full h-20 object-contain bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 🛍️ Product Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
            <p className="text-lg text-gray-500 flex items-center gap-2">
              <Box size={20} /> {product.brand}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold text-green-600 tracking-tight">
              ₹{(product.price * 80).toLocaleString("en-IN")}
            </span>
            <Badge variant="outline" className="text-sm text-yellow-700 border-yellow-400 bg-yellow-50">
              {Math.round(product.discountPercentage)}% OFF
            </Badge>
            <span className="ml-auto font-medium text-gray-700 flex items-center gap-1">
              <Star size={20} className="text-yellow-500" /> {product.rating}
            </span>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>

          {/*  Specs */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
            <div><strong>SKU:</strong> {product.sku}</div>
            <div><strong>Weight:</strong> {product.weight} g</div>
            <div><strong>Dimensions:</strong> {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth} mm</div>
            <div><strong>Min Qty:</strong> {product.minimumOrderQuantity}</div>
          </div>

          {/*  Availability */}
          <div className="flex items-center gap-4">
            <Badge variant={product.availabilityStatus === "Low Stock" ? "destructive" : "outline"}>
              {product.availabilityStatus}
            </Badge>
            <span className="text-sm text-gray-600">
              <Truck size={16} className="inline-block mr-1" /> {product.stock} in stock
            </span>
          </div>

          {/*  Add to Cart only */}
          <div className="flex flex-col gap-2 mt-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-base py-6 rounded-lg shadow-lg flex items-center justify-center"
              onClick={() => handleAddToCart(product)}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6 mr-2" /> : "Add to Cart"}
            </Button>

          </div>

          {/*  More Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mt-2">
            <div><Gift size={14} className="inline-block mr-1" /> Warranty: {product.warrantyInformation}</div>
            <div><Truck size={14} className="inline-block mr-1" /> Shipping: {product.shippingInformation}</div>
            <div><RefreshCw size={14} className="inline-block mr-1" /> Return Policy: {product.returnPolicy}</div>
          </div>
        </div>
      </div>


      {/* Reviews Section */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Customer Reviews</h2>
        <Separator />
        {product.reviews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((r, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 hover:shadow-lg p-5 transition bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {r.reviewerName}
                  </span>
                  <span className="text-yellow-600 flex items-center gap-1 font-semibold">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="inline-block"
                    >
                      <path d="M8 12.216l3.717 2.197-.996-4.28 3.293-2.848-4.332-.372L8 2.25l-1.682 4.663-4.332.372 3.293 2.848-.996 4.28z" />
                    </svg>
                    {r.rating}
                  </span>
                </div>
                <p className="italic text-sm mb-1">&ldquo;{r.comment}&rdquo;</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      <div className="w-full">
        <h4 className="text-2xl font-semibold mb-2">Recommended Products</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {skeletonLoading ? (
            [...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="w-full h-72 bg-gray-200 rounded-xl animate-pulse"
              />
            ))
          ) : recommendedProduct.length === 0 ? (
            <p className="text-center col-span-full text-gray-600">
              No products found matching filters.
            </p>
          ) : (
            recommendedProduct.map((product) => (
              <Link
                key={product.id}
                to={`/products/product-detail?id=${product.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all flex flex-col h-full overflow-hidden border border-gray-100">

                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-52 sm:h-56 object-cover"
                    />
                    {product.discountPercentage && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                    {product.availabilityStatus === "Low Stock" && (
                      <span className="absolute bottom-2 left-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded">
                        {product.availabilityStatus}
                      </span>
                    )}
                  </div>

                  {/* 📄 Product Info */}
                  <div className="p-4 flex flex-col h-full">
                    <h3 className="text-md font-semibold text-gray-800 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {product.brand}
                    </p>

                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-green-600">
                        {product.rating}
                      </span>
                      <StarIcon className="text-yellow-500 w-4 h-4 ml-1" />
                      <span className="ml-2 text-xs text-gray-400">
                        ({product.reviews.length} reviews)
                      </span>
                    </div>

                    <div className="text-lg font-bold text-gray-900">
                      ₹{(product.price * 80).toLocaleString("en-IN")}
                      {product.discountPercentage > 0 && (
                        <span className="ml-2 text-sm font-medium text-green-600">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>

                    <div className="text-xs mt-2 text-gray-600">
                      <p>
                        <strong>Category:</strong> {product.category}
                      </p>
                      <p>
                        <strong>Stock:</strong> {product.stock} units
                      </p>
                    </div>

                    {/* 🚀 Replaced Buttons with Feature Tags */}
                    <div className="mt-auto flex flex-wrap gap-2 pt-4 text-xs font-medium">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        📦 Free Shipping
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        🛡️ {product.warrantyInformation || '1 Week Warranty'}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        🔄 {product.returnPolicy || 'No Return'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
