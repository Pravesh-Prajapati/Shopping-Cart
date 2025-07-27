import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import men from "./images/men.jpg";
import women from "./images/women.jpg";
import beauty from "./images/beauty.jpg";
import electronics from "./images/electronics.jpg";
import watches from "./images/watches.jpg";
import { Link, useLocation } from "react-router-dom";
import { SearchContext } from "@/context/searchContext";
import { API } from "@/api/api";
import { ShoppingBag, Star, Tag, Boxes, Sparkles, CircleDollarSign, Store } from "lucide-react";

export default function Home() {
  const [shownProducts, setshownProducts] = useState([]);
  const [allProduct, setallProduct] = useState([]);
  const { searchValue, setSearchValue, setInputValue } = useContext(SearchContext);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(16);
  const location = useLocation();


  const categories = [
    {
      name: "All",
      image:
        "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/29327f40e9c4d26b.png",
    },
    { name: "Men", image: men },
    { name: "Women", image: women },
    { name: "Electronics", image: electronics },
    { name: "Beauty", image: beauty },
    { name: "Watches & Accessories", image: watches },
  ];



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let products = [];
      if (searchValue.trim() !== "") {
        const res = await axios.get(
          // `https://dummyjson.com/products/search?q=${searchValue}`
          `${API.PRODUCTS}/search?q=${searchValue}`
        );
        products = res.data.products;
      } else {
        // const res = await axios.get("https://dummyjson.com/products?limit=100");
        const res = await axios.get(`${API.PRODUCTS}?limit=100`);
        products = res.data.products;
      }
      setallProduct(products);
      setshownProducts(products.slice(0, 16));
      setLimit(16);
      setLoading(false);
    };
    fetchData();
  }, [searchValue]);

  const showMore = () => {
    const newLimit = limit + 16;
    setLimit(newLimit);
    setshownProducts(allProduct.slice(0, newLimit));
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setInputValue("");
    }
  }, [location.key]);


  console.log(shownProducts[0]);


  return (
  
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-white relative overflow-hidden">
      {/* 🌟 Floating Background Icons */}
      <div className="absolute top-10 left-10 opacity-5 z-0">
        <ShoppingBag size={120} strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-5 z-0">
        <Boxes size={120} strokeWidth={1} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 z-0">
        <ShoppingBag size={200} strokeWidth={0.5} />
      </div>

      {/* 💎 Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 py-8 relative z-10">
        {/* 🎯 Categories */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 bg-white p-6 rounded-xl shadow-md">
          {categories.map((cat) => (
            <Link
              to={
                cat.name === "All"
                  ? "/"
                  : `/products/?category=${encodeURIComponent(cat.name)}`
              }
              key={cat.name}
              className="flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm font-medium text-gray-700 text-center">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

        {/* 🛍️ Product Grid */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recommended for You
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {shownProducts.map((product) => (
              <Link
                to={`/products/product-detail?id=${product.id}`}
                key={product.id}
              >
                <div className="group relative border border-gray-200 hover:shadow-xl hover:border-blue-300 rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 bg-white flex flex-col h-full">
                  <div className="relative w-full h-52 overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                    />
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                        -{Math.round(product.discountPercentage)}% OFF
                      </span>
                    )}
                  </div>

                  {/* 📦 Product Details */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-full font-medium">
                        {product.category}
                      </span>
                      <span className="text-yellow-500 font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
                      {product.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{(product.price * 80).toFixed(0)}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        by <span className="font-semibold">{product.brand}</span>
                      </span>
                    </div>
                  </div>

                  {/* 🏷️ Tags */}
                  {product.tags?.length > 0 && (
                    <div className="px-4 pb-4 pt-0 flex gap-2 flex-wrap justify-center">
                      {product.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1"
                        >
                          <Tag size={12} /> #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}

            {/* 🚀 Show More Button */}
            {!loading && shownProducts.length < allProduct.length && (
              <button onClick={showMore}>
                <span className="text-sm font-medium text-gray-800">
                  Show more...
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
