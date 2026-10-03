import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addProduct } from "../../redux/slices/productSlice";
import { showToast } from "../../redux/slices/toastSlice";

function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(
    (state) => state.products.products
  );

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  ];

  const [categoryMode, setCategoryMode] =
    useState("existing");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    newCategory: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    image: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleCategoryModeChange = (event) => {
    const mode = event.target.value;

    setCategoryMode(mode);

    setFormData((previousData) => ({
      ...previousData,
      category: "",
      newCategory: ""
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedCategory =
      categoryMode === "existing"
        ? formData.category.trim()
        : formData.newCategory.trim();

    if (
      !formData.name.trim() ||
      !selectedCategory ||
      !formData.brand.trim() ||
      !formData.description.trim() ||
      !formData.image.trim()
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.price === "") {
      setError("Price is required");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (formData.stock === "") {
      setError("Stock is required");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    setError("");
    setSaving(true);

    const productData = {
      name: formData.name.trim(),
      category: selectedCategory,
      brand: formData.brand.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description.trim(),
      image: formData.image.trim()
    };

    try {
      await dispatch(
        addProduct(productData)
      ).unwrap();

      dispatch(
        showToast({
          message: "Product added successfully",
          type: "success"
        })
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      setError("Failed to add product");

      dispatch(
        showToast({
          message: "Failed to add product",
          type: "error"
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  const disabledInputClass =
    "w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-8">

      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/admin/products")
          }
          className="mb-3 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Products
        </button>

        <h1 className="text-3xl font-bold text-white">
          Add Product
        </h1>

        <p className="mt-1 text-slate-400">
          Add a new product to your store
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Enter the basic details of your product
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className={labelClass}
              >
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="categoryMode"
                className={labelClass}
              >
                Category Type
              </label>

              <select
                id="categoryMode"
                value={categoryMode}
                onChange={handleCategoryModeChange}
                className={inputClass}
              >
                <option value="existing">
                  Select Existing Category
                </option>

                <option value="new">
                  Add New Category
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="category"
                className={labelClass}
              >
                Existing Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={categoryMode === "new"}
                className={
                  categoryMode === "new"
                    ? disabledInputClass
                    : inputClass
                }
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="newCategory"
                className={labelClass}
              >
                New Category
              </label>

              <input
                id="newCategory"
                name="newCategory"
                type="text"
                placeholder="Enter new category"
                value={formData.newCategory}
                onChange={handleChange}
                disabled={categoryMode === "existing"}
                className={
                  categoryMode === "existing"
                    ? disabledInputClass
                    : inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="brand"
                className={labelClass}
              >
                Brand
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="Enter brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className={labelClass}
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Pricing & Inventory
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Set the price and stock quantity
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="price"
                className={labelClass}
              >
                Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ₹
                </span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="stock"
                className={labelClass}
              >
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Product Image
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Add the product image URL
            </p>
          </div>

          <div className="mt-6">

            <label
              htmlFor="image"
              className={labelClass}
            >
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="text"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={handleChange}
              className={inputClass}
            />

            {formData.image && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Image Preview
                </p>

                <div className="flex min-h-48 items-center justify-center rounded-lg bg-slate-900 p-4">

                  <img
                    src={formData.image}
                    alt={
                      formData.name ||
                      "Product preview"
                    }
                    className="max-h-48 max-w-full object-contain"
                  />

                </div>

              </div>
            )}

          </div>

        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="rounded-lg bg-slate-800 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Adding..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddProduct;