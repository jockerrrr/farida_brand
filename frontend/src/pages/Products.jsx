import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import prodAPI from "../services/product";
import sizeChartAPI from "../services/size_chart";
import "./Products.css";

const Products = () => {
  const { onAdd } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [count, setCount] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [sizeCharts, setSizeCharts] = useState([]);
  const [chartTab, setChartTab] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await prodAPI.getProductById(id);
        setProduct(res.data);
        setSelectedSize(res.data.sizes_available?.[0]?.size || "");

        if (res.data.size_chart?.length > 0) {
          const chartPromises = res.data.size_chart.map((chartId) =>
            sizeChartAPI.get_chart(chartId),
          );
          const chartResults = await Promise.all(chartPromises);
          setSizeCharts(chartResults.map((r) => r.data));
          setChartTab(0);
        }
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="prod-loading">Loading…</div>;

  if (!product)
    return (
      <div className="prod-not-found">
        <p>Product not found</p>
        <button onClick={() => navigate("/")}>← Back to Shop</button>
      </div>
    );

  const sizes = product.sizes_available?.length ? product.sizes_available : [];
  const images = product.images?.length ? product.images : [];
  const price = product.Price;
  const name = product.Product_name;

  const selectedSizeObj = sizes.find(s => s.size === selectedSize);
  const isPreorder = !selectedSizeObj || selectedSizeObj.stock <= 0;

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setCount(1);
  };

  const handleAddToCart = () => {
    onAdd({
      id: product._id,
      displayName: name,
      price: String(price),
      size: selectedSize,
      images: images[0] || "",
      quantity: count,
    });
  };

  return (
    <div className="prod-page">
      <button className="prod-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="prod-inner">
        {/* Image gallery */}
        <div className="prod-gallery">
          {isPreorder && <div className="prod-soldout-badge">PRE-ORDER</div>}
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="prod-swiper"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`${name} view ${i + 1}`}
                  className="prod-swiper-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Details */}
        <div className="prod-details">
          <h1 className="prod-name">{name}</h1>
          <p className="prod-price">LE {price}.00</p>

          {/* Size selector */}
          <p className="prod-size-label">Select Size</p>
          <div className="prod-sizes">
            {sizes.map((s) => (
              <button
                key={s.size}
                className={`prod-size-btn 
                  ${selectedSize === s.size ? "prod-size-btn--active" : ""} 
                  ${s.stock === 0 ? "prod-size-btn--soldout" : ""}`}
                onClick={() => handleSizeChange(s.size)}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* Pre-order message */}
          {isPreorder && (
            <p className="prod-size-soldout-msg">
              Sold out – Don't miss the restock. Pre-order now to claim yours. Ships immediately when available.
            </p>
          )}

          {/* Quantity — always shown */}
          <div className="prod-qty">
            <button
              className="prod-qty-btn"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
            >
              −
            </button>
            <span className="prod-qty-num">{count}</span>
            <button
              className="prod-qty-btn"
              onClick={() => setCount((c) => c + 1)}
            >
              +
            </button>
          </div>

          {/* Add to cart / Pre-order button */}
          <button
            className={`prod-add-btn ${isPreorder ? "prod-add-btn--preorder" : ""}`}
            onClick={handleAddToCart}
          >
            {isPreorder ? "PRE-ORDER" : "ADD TO CART"}
          </button>

          {/* Size chart accordion */}
          {sizeCharts.length > 0 && (
            <div className="prod-accordion">
              <button
                className="prod-accordion-toggle"
                onClick={() => setShowSizeChart((v) => !v)}
              >
                <span>Size Chart</span>
                <span>{showSizeChart ? "−" : "+"}</span>
              </button>
              {showSizeChart && (
                <div className="prod-chart-wrap">
                  {sizeCharts.map((chart) => (
                    <div key={chart._id} className="prod-chart-block">
                      <p className="prod-chart-name">{chart.chart_name}</p>
                      <table className="prod-chart-table">
                        <thead>
                          <tr>
                            <th className="prod-chart-th">Size</th>
                            {Object.keys(chart.measurments[0].values).map(
                              (key) => (
                                <th key={key} className="prod-chart-th">
                                  {key}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {chart.measurments.map((row) => (
                            <tr key={row._id}>
                              <td className="prod-chart-td prod-chart-td--size">
                                {row.size}
                              </td>
                              {Object.values(row.values).map((val, i) => (
                                <td key={i} className="prod-chart-td">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;