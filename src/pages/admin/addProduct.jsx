import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import {
  FiBox,
  FiHash,
  FiImage,
  FiLayers,
  FiPackage,
  FiSave,
  FiTag,
  FiX,
} from "react-icons/fi";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const categoryStructure = {
    Men: [
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Trousers",
      "Hoodies & Sweatshirts",
      "Jackets",
      "Shorts",
      "Shoes",
      "Slippers",
    ],
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

  const inputStyle =
    "w-full h-11 sm:h-12 px-3.5 sm:px-4 bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base";

  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    setSubCategory("");
  };

  async function AddPrdouct() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (images.length <= 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await Promise.all(
        images.map((image) => mediaUpload(image)),
      );

      const product = {
        productId,
        barcode,
        name,
        altNames: altNames ? altNames.split(",").map((n) => n.trim()) : [],
        description,
        images: imageUrls,
        labelledPrice,
        price,
        stock,
        category: mainCategory,
        subCategory,
        colors: colors ? colors.split(",").map((c) => c.trim()) : [],
        sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      };

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/products/",
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

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
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiPackage />
              Product Management
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Add Product
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Create a new product with images, pricing, stock, and category
              details.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3.5 sm:py-4 border border-zinc-100 shadow-sm self-start">
            <p className="text-xs sm:text-sm text-zinc-500">Images Added</p>
            <h3 className="text-2xl sm:text-3xl font-black">{images.length}</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-6">
          <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                <FiBox className="text-lg sm:text-xl text-[#9b6b43]" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Product Information
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Fill in the product details below.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              <Field label="Product ID" icon={<FiHash />}>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter Product ID"
                  className={inputStyle}
                />
              </Field>

              <Field label="Barcode">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scan or enter barcode"
                  className={inputStyle}
                />
              </Field>

              <Field label="Product Name" icon={<FiTag />}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Product Name"
                  className={inputStyle}
                />
              </Field>

              <Field label="Alternative Names">
                <input
                  type="text"
                  value={altNames}
                  onChange={(e) => setAltNames(e.target.value)}
                  placeholder="shirt, cotton, casual"
                  className={inputStyle}
                />
              </Field>

              <Field label="Main Category" icon={<FiLayers />}>
                <select
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  className={inputStyle}
                >
                  <option value="" disabled>
                    Select Main Category
                  </option>
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
                  className={inputStyle}
                  disabled={!mainCategory}
                >
                  <option value="" disabled>
                    Select Sub Category
                  </option>
                  {mainCategory &&
                    categoryStructure[mainCategory].map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                </select>
              </Field>

              <Field label="Available Colors">
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Red, Blue, Black"
                  className={inputStyle}
                />
              </Field>

              <Field label="Available Sizes">
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className={inputStyle}
                />
              </Field>

              <Field label="Labelled Price">
                <input
                  type="number"
                  value={labelledPrice}
                  onChange={(e) => setLabelledPrice(e.target.value)}
                  placeholder="Enter labelled price"
                  className={inputStyle}
                />
              </Field>

              <Field label="Selling Price">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter selling price"
                  className={inputStyle}
                />
              </Field>

              <Field label="Stock">
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Enter stock quantity"
                  className={inputStyle}
                />
              </Field>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                  Description
                </label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write product description..."
                  className="w-full p-3.5 sm:p-4 bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl resize-none outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                />
              </div>
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
                  Upload clear product photos. The first image will be used as
                  the main image.
                </p>

                <label className="flex flex-col items-center justify-center h-40 sm:h-52 border-2 border-dashed border-white/20 rounded-2xl sm:rounded-3xl cursor-pointer hover:border-[#c99a6b] transition">
                  <FaCamera className="text-3xl sm:text-4xl text-[#c99a6b] mb-2 sm:mb-3" />
                  <p className="font-bold text-sm sm:text-base">
                    Click to upload
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    PNG, JPG, WEBP
                  </p>

                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/png, image/jpeg, image/webp"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </section>

            {imagePreviews.length > 0 && (
              <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-5">
                <h3 className="font-black mb-3 sm:mb-4 text-sm sm:text-base">
                  Preview Images
                </h3>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative h-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF7F2] group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        onClick={() => {
                          setSelectedImageUrl(preview);
                          setIsModalOpen(true);
                        }}
                        className="w-full h-full object-cover cursor-pointer"
                      />

                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-red-500 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-black mb-2">
                Ready to publish?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6">
                Check product details before adding it to your store.
              </p>

              <button
                onClick={AddPrdouct}
                disabled={isSubmitting}
                className="w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition disabled:opacity-60"
              >
                <FiSave />
                {isSubmitting ? "Adding Product..." : "Add Product"}
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

      {isModalOpen && selectedImageUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-[2rem] p-2 sm:p-3 shadow-2xl w-full">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedImageUrl(null);
              }}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white text-zinc-900 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow z-10"
            >
              <FiX />
            </button>

            <img
              src={selectedImageUrl}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] sm:max-h-[82vh] object-contain rounded-xl sm:rounded-[1.5rem] mx-auto"
            />
          </div>
        </div>
      )}
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
