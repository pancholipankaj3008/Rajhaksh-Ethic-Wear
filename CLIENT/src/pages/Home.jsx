import HeroCarousel from "../components/Hero";
// import TopStrip from "../components/Strip";
import CollectionShowcase from "../components/CollectionShowcase";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import {
  GetFeaturedProducts as fetchFeaturedProducts,
  GetNewArrivals as fetchNewArrivals,
} from "../features/product/productThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import SkeletonGrid from "../components/SkeletonGrid";

function BackendProductRails() {
  const dispatch = useAppDispatch();
  const { featuredProducts, newArrivals, featuredLoading, newArrivalsLoading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const rails = [
    ["Editor's Picks", featuredProducts],
    ["Just Dropped", newArrivals],
  ];

  return (
    <>
    <section className="section" style={{ background: "#faf8f5" }}>
      <div className="container" style={{ display: "grid", gap: 42 }}>
        {rails.map(([title, products]) => (
          <div key={title}>
            <span className="eyebrow">Raj Haksh Collection</span>
            <h2 className="title" style={{ marginBottom: 20 }}>{title}</h2>
            {(title === "Editor's Picks" ? featuredLoading : newArrivalsLoading) ? <SkeletonGrid count={4} /> : error ? <div className="empty-state" role="alert">{error}</div> : products.length === 0 ? (
              <div className="empty-state" style={{ padding: 28 }}>No {title.toLowerCase()} from backend yet.</div>
            ) : (
              <div className="grid grid-4">{products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}</div>
            )}
          </div>
        ))}
      </div>
    </section>
              </>
  );
}

export function Home() {
  return (
    <>
      <HeroCarousel />
      {/* <TopStrip /> */}
      {/* <CollectionGrid /> */}
      <BackendProductRails />
      <CollectionShowcase />
      {/* <PromoNewsletter /> */}
    </>
  );
}
