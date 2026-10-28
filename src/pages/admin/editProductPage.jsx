import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiCamera,
  FiTrash2,
  FiSave,
  FiPackage,
  FiHash,
  FiTag,
  FiLayers,
  FiImage,
  FiX,
} from "react-icons/fi";

export default function EditProductPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getFieldValue = (product, keys) => {
    for (const key of keys) {
      const value = product?.[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return "";
  };

  const normalizeListValue = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const productState = location.state || {};

  const productId = getFieldValue(productState, ["productId"]) || "";
  const productRecordId =
    getFieldValue(productState, ["productId", "_id", "id"]) || "";
  const [barcode] = useState(getFieldValue(productState, ["barcode"]) || "");
  const [name, setName] = useState(getFieldValue(productState, ["name"]) || "");
  const [altNames] = useState(
    normalizeListValue(
      getFieldValue(productState, ["altNames", "alternateNames", "aliases"]),
    ).join(", ") || "",
  );
  const [description, setDescription] = useState(
    getFieldValue(productState, ["description"]) || "",
  );
  const [labelledPrice, setLabelledPrice] = useState(
    getFieldValue(productState, ["labelledPrice"]) || "",
  );
  const [price, setPrice] = useState(
    getFieldValue(productState, ["price"]) || "",
  );
  const [stock, setStock] = useState(
    getFieldValue(productState, ["stock"]) || "",
  );
  const [mainCategory, setMainCategory] = useState(
    getFieldValue(productState, ["category", "mainCategory", "main"]) || "",
  );
  const [subCategory, setSubCategory] = useState(
    getFieldValue(productState, [
      "subCategory",
      "subcategory",
      "sub_category",
      "sub",
    ]) || "",
  );
  const [colors, setColors] = useState(
    normalizeListValue(
      getFieldValue(productState, ["colors", "color", "availableColors"]),
    ).join(", ") || "",
  );
  const [sizes, setSizes] = useState(
    normalizeListValue(
      getFieldValue(productState, ["sizes", "availableSizes"]),
    ).join(", ") || "",
  );
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(
    getFieldValue(productState, ["images"]) || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryStructure = {
    Men: ["T-Shirts",
        "Shirts",
        "Jeans",
        "Trousers",
        "Hoodies & Sweatshirts",
        "Jackets",
        "Shorts",
        "Shoes",
        "Slippers",],
    Women: [
      "Dresses",
      "Tops",
      "Blouses",
      "Skirts",
      "Jeans",
      "Leggings",
      "Jackets",
      "Shorts",
      "Shoes",
      "Slippers",
    ],
    Kids: [
      "Shorts",
      "T-Shirts",
      "Shirts",
      "Hoodies & Sweatshirts",
      "Jackets",
      "Shoes",
    ],
    Accessories: [
      "Bags",
      "Wallets",
      "Watches",
      "Sunglasses",
      "Belts",
      "Hats / Caps",
      "Jewelry",
    ],
  };

  useEffect(() => {
    const nextProduct = location.state || {};

    setName(getFieldValue(nextProduct, ["name"]) || "");
    setDescription(getFieldValue(nextProduct, ["description"]) || "");
    setLabelledPrice(getFieldValue(nextProduct, ["labelledPrice"]) || "");
    setPrice(getFieldValue(nextProduct, ["price"]) || "");
    setStock(getFieldValue(nextProduct, ["stock"]) || "");
    setMainCategory(
      getFieldValue(nextProduct, ["category", "mainCategory", "main"]) || "",
    );
    setSubCategory(
      getFieldValue(nextProduct, [
        "subCategory",
        "subcategory",
        "sub_category",
        "sub",
      ]) || "",
    );
    setColors(
      normalizeListValue(
        getFieldValue(nextProduct, ["colors", "color", "availableColors"]),
      ).join(", ") || "",
    );
    setSizes(
      normalizeListValue(
        getFieldValue(nextProduct, ["sizes", "availableSizes"]),
      ).join(", ") || "",
    );
    setImagePreviews(getFieldValue(nextProduct, ["images"]) || []);
  }, [location.state]);

  const inputStyle =
    "w-full h-11 sm:h-12 px-3.5 sm:px-4 bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base";

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);

    const previews = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
          }),
      ),
    );

    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const EditProduct = async () => {
    if (!name || !price || !mainCategory) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!productRecordId) {
      toast.error(
        "Product ID is missing. Return to the product list and try again.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls = location.state?.images || [];

      if (images.length > 0) {
        const newUrls = await Promise.all(
          images.map((file) => mediaUpload(file)),
        );
        imageUrls = [...imageUrls, ...newUrls];
      }

      const productData = {
        productId: productId || undefined,
        barcode,
        name,
        altNames: altNames ? altNames.split(",").map((n) => n.trim()) : [],
        description,
        images: imageUrls,
        labelledPrice: Number(labelledPrice),
        price: Number(price),
        stock: Number(stock) || 0,
        category: mainCategory,
        subCategory: subCategory || "",
        colors: colors ? colors.split(",").map((c) => c.trim()) : [],
        sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      };

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${encodeURIComponent(productRecordId)}`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiPackage />
              Product Editor
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Edit Product
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Update product details, images, pricing, stock and category
              information.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3.5 sm:py-4 border border-zinc-100 shadow-sm self-start">
            <p className="text-xs sm:text-sm text-zinc-500">Product ID</p>
            <h3 className="text-base sm:text-xl font-black truncate max-w-[180px] sm:max-w-[220px]">
              {productId || "N/A"}
            </h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-6">
          <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                <FiTag className="text-lg sm:text-xl text-[#9b6b43]" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Product Information
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Modify the product information below.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              <Field label="Product ID" icon={<FiHash />}>
                <input
                  value={productId}
                  disabled
                  className={`${inputStyle} opacity-60`}
                />
              </Field>

              <Field label="Barcode">
                <input
                  value={barcode}
                  disabled
                  className={`${inputStyle} opacity-60`}
                />
              </Field>

              <Field label="Product Name" icon={<FiTag />}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyle}
                />
              </Field>

              <Field label="Alternative Names">
                <input
                  value={altNames}
                  disabled
                  className={`${inputStyle} opacity-60`}
                />
              </Field>

              <Field label="Main Category" icon={<FiLayers />}>
                <select
                  value={mainCategory}
                  onChange={(e) => {
                    setMainCategory(e.target.value);
                    setSubCategory("");
                  }}
                  className={inputStyle}
                >
                  {Object.keys(categoryStructure).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Sub Category">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!mainCategory}
                  className={inputStyle}
                >
                  {mainCategory &&
                    (categoryStructure[mainCategory] || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </Field>

              <Field label="Colors">
                <input
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Red, Blue, Black"
                  className={inputStyle}
                />
              </Field>

              <Field label="Sizes">
                <input
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className={inputStyle}
                />
              </Field>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 resize-none outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                />
              </div>

              <Field label="Labelled Price">
                <input
                  type="number"
                  value={labelledPrice}
                  onChange={(e) => setLabelledPrice(e.target.value)}
                  className={inputStyle}
                />
              </Field>

              <Field label="Selling Price">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputStyle}
                />
              </Field>

              <Field label="Stock">
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={inputStyle}
                />
              </Field>
            </div>
          </section>

          <aside className="space-y-4 sm:space-y-6">
            <section className="bg-zinc-950 text-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#9b6b43,transparent_35%)] opacity-60" />

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center mb-4 sm:mb-5">
                  <FiImage className="text-lg sm:text-xl text-[#c99a6b]" />
                </div>

                <h2 className="text-xl sm:text-2xl font-black">
                  Product Images
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400 mt-2 mb-4 sm:mb-6">
                  Add new product images or remove unnecessary ones.
                </p>

                <label className="border-2 border-dashed border-white/20 hover:border-[#c99a6b] rounded-2xl sm:rounded-3xl h-40 sm:h-52 flex flex-col items-center justify-center cursor-pointer transition">
                  <FiCamera className="text-3xl sm:text-5xl text-[#c99a6b] mb-2 sm:mb-4" />
                  <p className="font-bold text-white text-sm sm:text-base">
                    Add more images
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    PNG, JPG, WEBP
                  </p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            {imagePreviews.length > 0 && (
              <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-5">
                <h3 className="font-black mb-3 sm:mb-4 text-sm sm:text-base">
                  Product Gallery
                </h3>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square bg-[#FAF7F2] group"
                    >
                      <img
                        src={preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />

                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white text-red-500 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-black mb-2">
                Save changes?
              </h3>

              <p className="text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6">
                Review all product details before updating this product.
              </p>

              <button
                onClick={EditProduct}
                disabled={isSubmitting}
                className="w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition disabled:opacity-60"
              >
                <FiSave />
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>

              <Link
                to="/admin/products"
                className="w-full mt-2.5 sm:mt-3 bg-[#FAF7F2] text-zinc-700 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center hover:bg-zinc-200 transition"
              >
                Cancel
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
        {icon && <span className="text-[#9b6b43]">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
