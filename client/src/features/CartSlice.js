import { API } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
};

export const addToCartItems = createAsyncThunk(
    "cart/addToCartItems",
    async (product, { rejectWithValue }) => {
        try {
            const existingItem = await axios.get(`${API.CARTS}?productId=${product.productId}&uid=${product.uid}`);
            if (existingItem.data.length > 0) {
                return rejectWithValue("Item already exists in cart");
            } else {
                const response = await axios.post(`${API.CARTS}`, product);
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.message || "Failed to add item");
        }
    }
);

export const getCartItems = createAsyncThunk(
    "cart/getCartItems",
    async (uid, { rejectWithValue }) => {
        try {
            const cartResponse = await axios.get(`${API.CARTS}?uid=${uid}`);
            const cartItems = cartResponse.data;
            const enrichedCart = await Promise.all(
                cartItems.map(async (item) => {
                    const response = await axios.get(`${API.PRODUCTS}/${item.productId}`);
                    return {
                        ...item,
                        product: response.data,
                    };
                })
            );
            return enrichedCart;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch cart items");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (cartItemId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API.CARTS}/${cartItemId}`);
            return cartItemId;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to remove item");
        }
    }
);

export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${API.CARTS}/${id}`, { quantity });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to update quantity");
        }
    }
);

export const emptyCart = createAsyncThunk(
    "cart/emptyCart",
    async (uid, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API.CARTS}?uid=${uid}`);
            const userCartItems = res.data;

            await Promise.all(
                userCartItems.map((item) => axios.delete(`${API.CARTS}/${item.id}`))
            );

            return true;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to empty cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add to Cart
        builder
            .addCase(addToCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems.push(action.payload);
                state.error = null;
                toast.success("Item added to cart");
            })
            .addCase(addToCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add item";
                toast.error(action.payload || "Failed to add item");
            });

        // Get Cart Items
        builder
            .addCase(getCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                state.error = null;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch cart items";
                toast.error("Failed to fetch cart items");
            });

        // Remove from Cart
        builder
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
                state.error = null;
                toast.success("Item removed from cart");
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to remove item";
                toast.error(action.payload || "Failed to remove item");
            });

        // Update Quantity
        builder
            .addCase(updateCartQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.cartItems = state.cartItems.map((item) => {
                    if (item.id === updated.id) {
                        return {
                            ...item,
                            ...updated,
                        };
                    }
                    return item;
                });
                state.error = null;
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update quantity";
            });

        // Empty Cart
        builder
            .addCase(emptyCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(emptyCart.fulfilled, (state) => {
                state.loading = false;
                state.cartItems = [];
                state.error = null;
            })
            .addCase(emptyCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to empty cart";
            });
    },
});

export default cartSlice.reducer;
