import { createSlice } from "@reduxjs/toolkit";
import { GetAllProducts, GetFeaturedProducts, GetNewArrivals, GetRelatedProducts, GetSingleProduct } from "./productThunk";

const initialState = {
  products: [],
  product: null,
  featuredProducts: [],
  newArrivals: [],
  relatedProducts: [],
  featuredLoading: false,
  newArrivalsLoading: false,
  totalProducts: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  productLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct(state) {
      state.product = null;
      state.relatedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(GetAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(GetAllProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      .addCase(GetSingleProduct.pending, (state) => { state.productLoading = true; state.product = null; state.relatedProducts = []; state.error = null; })
      .addCase(GetSingleProduct.fulfilled, (state, action) => { state.productLoading = false; state.product = action.payload.product; })
      .addCase(GetSingleProduct.rejected, (state, action) => { state.productLoading = false; state.product = null; state.error = action.payload?.message || "Unable to fetch product"; })
      .addCase(GetFeaturedProducts.pending, (state) => { state.featuredLoading = true; })
      .addCase(GetFeaturedProducts.fulfilled, (state, action) => { state.featuredLoading = false; state.featuredProducts = action.payload.products || []; })
      .addCase(GetFeaturedProducts.rejected, (state, action) => { state.featuredLoading = false; state.error = action.payload?.message || "Unable to load featured products"; })
      .addCase(GetNewArrivals.pending, (state) => { state.newArrivalsLoading = true; })
      .addCase(GetNewArrivals.fulfilled, (state, action) => { state.newArrivalsLoading = false; state.newArrivals = action.payload.products || []; })
      .addCase(GetNewArrivals.rejected, (state, action) => { state.newArrivalsLoading = false; state.error = action.payload?.message || "Unable to load new arrivals"; })
      .addCase(GetRelatedProducts.fulfilled, (state, action) => { state.relatedProducts = action.payload.products || []; });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
