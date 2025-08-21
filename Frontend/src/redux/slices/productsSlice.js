import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import axios from 'axios';

//async thunk to fetch products
export const fetchProductsByFilters = createAsyncThunk(
    'products/fetchProducts', 
    async ({
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
    }) => {
  const query = new URLSearchParams();
  if (collection) query.append('collection', collection);
    if (size) query.append('size', size);
    if (color) query.append('color', color);
    if (gender) query.append('gender', gender);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (sortBy) query.append('sortBy', sortBy);
    if (search) query.append('search', search);
    if (category) query.append('category', category);
    if (material) query.append('material', material);
    if (brand) query.append('brand', brand);
    if (limit) query.append('limit', limit);

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`);
    return response.data;
});

//async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
    'products/fetchProductDetails',
    async (productId) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
        );
        return response.data;
    }
);

//async thunk to create products
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData) => {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
        });
        return response.data;
    }
);

//async thunk to delete products
export const deleteProducts = createAsyncThunk(
    'products/deleteProducts',
    async (productId) => {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
        });
        return response.data;
    }
);

//async thunk to update products
export const updateProducts = createAsyncThunk(
    'products/updateProducts',
    async ({ productId, productData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
             productData,
             {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
             }
            );
        return response.data;
    }
);

//async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    'products/fetchSimilarProducts',
    async (productId) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${productId}`
        );
        return response.data;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        selectedProduct: null, //store details of a single product
        similarProducts: [],
        loading: false,
        error: null,
        filters:{
            category: '',
            collection: '',
            size: '',
            color: '',
            gender: '',
            minPrice: '',
            maxPrice: '',
            sortBy: '',
            search: '',
            material: '',
            brand: '',
            limit: '',
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                category: '',
                collection: '',
                size: '',
                color: '',
                gender: '',
                minPrice: '',
                maxPrice: '',
                sortBy: '',
                search: '',
                material: '',
                brand: '',
                limit: '',
            }
        }
    },
    extraReducers: (builder) => {
        builder
        //handle fetching products by filters
            .addCase(fetchProductsByFilters.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled,(state,action)=>{
                state.loading= false;
                state.products = Array.isArray(action.payload)? action.payload:[];
            })
            .addCase(fetchProductsByFilters.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message;
            })
            //handle fetching single product details
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //handle updating products
            .addCase(updateProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProducts.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex(
                    (product) => product._id === updatedProduct._id
                );
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })
            .addCase(updateProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //handle fetching similar products
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
},
});

export const { setFilters, resetFilters } = productSlice.actions;

export default productSlice.reducer;
