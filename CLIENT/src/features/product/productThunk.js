import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFeaturedProducts, getNewArrivals, getProduct, getProducts, getRelatedProducts } from "./productAPI";

function rejectWithApiError(thunkAPI, error, fallback) {
  return thunkAPI.rejectWithValue(error.response?.data || { message: fallback });
}

export const GetAllProducts = createAsyncThunk("product/getAll", async (params, thunkAPI) => {
  try { return (await getProducts(params)).data; } catch (error) { return rejectWithApiError(thunkAPI, error, "Unable to fetch products"); }
});

export const GetSingleProduct = createAsyncThunk("product/getOne", async (id, thunkAPI) => {
  try { return (await getProduct(id)).data; } catch (error) { return rejectWithApiError(thunkAPI, error, "Unable to fetch product"); }
});

export const GetFeaturedProducts = createAsyncThunk("product/getFeatured", async (_, thunkAPI) => {
  try { return (await getFeaturedProducts()).data; } catch (error) { return rejectWithApiError(thunkAPI, error, "Unable to fetch featured products"); }
});

export const GetNewArrivals = createAsyncThunk("product/getNewArrivals", async (_, thunkAPI) => {
  try { return (await getNewArrivals()).data; } catch (error) { return rejectWithApiError(thunkAPI, error, "Unable to fetch new arrivals"); }
});

export const GetRelatedProducts = createAsyncThunk("product/getRelated", async (id, thunkAPI) => {
  try { return (await getRelatedProducts(id)).data; } catch (error) { return rejectWithApiError(thunkAPI, error, "Unable to fetch related products"); }
});
