import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  editProduct
} from "../../redux/slices/productSlice";

function ProductEditForm({ product, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: product.name || "",
    category: product.category || "",
    brand: product.brand || "",
    price: product.price ?? "",
    stock: product.stock ?? "",
    description: product.description || "",
    image: product.image || ""
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
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
      category: formData.category.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description.trim(),
      image: formData.image.trim()
    };

    try {
      await dispatch(
        editProduct({
          id,
          productData
        })
      ).unwrap();

      alert("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

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
          Edit Product
        </h1>

        <p className="mt-1 text-slate-400">
          Update product information and inventory
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
              Update the basic product details
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

            <div>
              <label
                htmlFor="category"
                className={labelClass}
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
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
              Manage price and stock
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
              Update the product image
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
                    alt={formData.name}
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
              ? "Updating..."
              : "Update Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    products,
    loading
  } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const product = products.find(
    (item) =>
      String(item.id) === String(id)
  );

  if (loading && !product) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-400">
          Loading product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

        <h2 className="text-xl font-semibold text-white">
          Product Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          The requested product does not exist.
        </p>

        <button
          type="button"
          onClick={() =>
            window.history.back()
          }
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Go Back
        </button>

      </div>
    );
  }

  return (
    <ProductEditForm
      key={product.id}
      product={product}
      id={id}
    />
  );
}

export default EditProduct;