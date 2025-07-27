import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Filter,
  Star,
  StarIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API } from "@/api/api";

function ProductCategory() {
  // const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("category");
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [rating, setRating] = useState("all");
  const [stockRange, setStockRange] = useState("all");
  const [discounted, setDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // console.log(categoryName)

  const options = [
    { label: "Default", value: "default", icon: "🔄" },
    { label: "Price: Low to High", value: "price-asc", icon: "⬆️" },
    { label: "Price: High to Low", value: "price-desc", icon: "⬇️" },
    { label: "Top Rated", value: "rating-desc", icon: "⭐" },
    { label: "Newest", value: "newest", icon: "🆕" },
  ];
  const priceOptions = [
    { label: "All", value: "all" },
    { label: "Under ₹500", value: "0-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "₹1000 - ₹2000", value: "1000-2000" },
    { label: "Above ₹2000", value: "2000+" },
  ];

  const categoriesMap = {
    Men: ["mens-shirts", "mens-shoes", "mens-watches"],
    Women: [
      "womens-watches",
      "womens-bags",
      "womens-jewellery",
      "womens-dresses",
      "womens-shoes",
    ],
    Electronics: ["smartphones", "laptops", "tablets", "mobile-accessories"],
    Beauty: ["beauty", "skin-care", "fragrances"],
    "Watches & Accessories": [
      "mens-watches",
      "womens-watches",
      "sunglasses",
      "sports-accessories",
    ],
  };

  const stockOptions = [
    { label: "All", value: "all" },
    { label: "Low Stock (1-20)", value: "1-20" },
    { label: "Medium Stock (21-100)", value: "21-100" },
    { label: "High Stock (101+)", value: "101+" },
  ];

  const subcategories = categoriesMap[categoryName] || [];

  const handleSortChange = (value) => {
    setSortBy(value);
    console.log(value);
  };
  //   category filter
  const handleCategoryChange = (value) => {
    console.log(value);
    setSelectedSubCategory(value);
    // setSubCategories([]);
  };
  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  };
  //   rating filter
  const handleRatingChange = (value) => {
    setRating(value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let fetchedProducts = [];
      if (selectedSubCategory === "All") {
        const responses = await Promise.all(
          categoriesMap[categoryName].map((subcat) =>
            // axios.get(`https://dummyjson.com/products/category/${subcat}`)
            axios.get(`${API.PRODUCTS}/category/${subcat}`)
          )
        );
        // console.log(responses)
        fetchedProducts = responses.flatMap((res) => res.data.products);
      } else {
        const res = await axios.get(
          // `https://dummyjson.com/products/category/${selectedSubCategory}`
          `${API.PRODUCTS}/category/${selectedSubCategory}`
        );
        fetchedProducts = res.data.products;
      }
      setProducts(fetchedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [selectedSubCategory, categoryName]);

  //
  useEffect(() => {
    let filtered = [...products];
    // Sorting logic
    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating-desc")
      filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") filtered.sort((a, b) => b.id - a.id);

    if (priceRange !== "all") {
      if (priceRange === "0-500") {
        filtered = filtered.filter((p) => p.price * 80 < 500);
      } else if (priceRange === "500-1000") {
        filtered = filtered.filter(
          (p) => p.price * 80 >= 500 && p.price * 80 <= 1000
        );
      } else if (priceRange === "1000-2000") {
        filtered = filtered.filter(
          (p) => p.price * 80 > 1000 && p.price * 80 <= 2000
        );
      } else if (priceRange === "2000+") {
        filtered = filtered.filter((p) => p.price * 80 > 2000);
      }
    }

    // Rating filter
    if (rating !== "all") {
      filtered = filtered.filter(
        (p) => Math.floor(p.rating) >= parseInt(rating)
      );
    }

    // Discounted filter
    if (discounted) {
      filtered = filtered.filter((p) => p.discountPercentage > 0);
    }

    // Stock filter
    if (stockRange !== "all") {
      if (stockRange === "1-20") {
        filtered = filtered.filter((p) => p.stock >= 1 && p.stock <= 20);
      } else if (stockRange === "21-100") {
        filtered = filtered.filter((p) => p.stock >= 21 && p.stock <= 100);
      } else if (stockRange === "101+") {
        filtered = filtered.filter((p) => p.stock > 100);
      }
    }

    setSortedProducts(filtered);
  }, [products, sortBy, priceRange, rating, discounted, stockRange]);

  return (
    <>
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> */}
      <div className="md:container mx-auto p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-500"><ChevronLeft className="w-6 h-6" />Go Back</button>
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold text-gray-800 text-center md:text-left">
            Filters & Sorting
          </h1>

          <div className="flex flex-wrap justify-start md:justify-end gap-2">
            {options.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm md:text-base rounded-md font-medium transition ${sortBy === option.value
                  ? "bg-blue-600 text-white border border-blue-700 shadow-md hover:bg-blue-600"
                  : "bg-white text-gray-700 border hover:bg-blue-50"
                  }`}
              >
                <span className="text-sm">{option.icon}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm  text-gray-700 bg-gray-50 transition"
          >
            {showFilters ? (
              <>
                <X className="w-5 h-5 text-blue-600" />
                Close Filters
              </>
            ) : (
              <>
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Products
              </>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div
            className={`${showFilters ? "block" : "hidden"
              } lg:block w-full lg:w-1/4 p-4 border rounded space-y-6 bg-white shadow-sm 
             h-[50vh] overflow-y-auto md:h-auto md:overflow-visible 
               lg:h-[calc(100vh-100px)] lg:overflow-y-auto lg:sticky lg:top-[100px]`}
          >
            {/* Category */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <Select
                value={selectedSubCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full">
                  {selectedSubCategory === "All"
                    ? "All Categories"
                    : selectedSubCategory}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {subcategories.map((cat, idx) => (
                    <SelectItem key={idx} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Category */}
            {selectedSubCategory === "Clothing" && (
              <div>
                <h3 className="font-semibold mb-2">Sub Category</h3>
                <div className="flex flex-col max-h-40 overflow-y-auto space-y-3">
                  {/* map subCategoryOptions here */}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="flex flex-col space-y-2 text-sm">
                {priceOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      value={opt.value}
                      onChange={handlePriceChange}
                      className="accent-blue-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold mb-2">Minimum Rating</h3>
              <RadioGroup
                value={rating}
                onValueChange={handleRatingChange}
                className="space-y-2"
              >
                {["all", "4", "3"].map((val) => (
                  <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={val} id={`rating-${val}`} />
                    <label htmlFor={`rating-${val}`} className="text-sm">
                      {val === "all" ? "All Ratings" : `${val}+ Stars & above`}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Discount */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={discounted}
                onCheckedChange={(checked) => setDiscounted(checked)}
              />
              <span>Discounted Items</span>
            </div>

            {/* Stock */}
            <div className="flex flex-col space-y-2">
              {stockOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="stock"
                    value={opt.value}
                    checked={stockRange === opt.value}
                    onChange={(e) => setStockRange(e.target.value)}
                    className="accent-blue-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {loading ? (
                [...Array(8)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-72 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))
              ) : sortedProducts.length === 0 ? (
                <p className="text-center col-span-full text-gray-600">
                  No products found matching filters.
                </p>
              ) : (

                sortedProducts.map((product) => (
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
      </div>
    </>
  );
}

export default ProductCategory;
