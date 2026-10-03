import {
  useEffect,
  useState
} from "react";

import {
  useForm
} from "react-hook-form";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  Link
} from "react-router-dom";

import {
  createOrder
} from "../services/orderService";

import {
  updateProduct
} from "../services/productService";

import {
  getUserAddresses,
  addUserAddress
} from "../services/userService";

import {
  clearCart
} from "../redux/slices/cartSlice";

import {
  addOrder
} from "../redux/slices/orderSlice";

import {
  productImages
} from "../constants/productImages";

import {
  getCouponByCode
} from "../services/couponService";

function Checkout() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const [
    addresses,
    setAddresses
  ] = useState([]);

  const [
    selectedAddressId,
    setSelectedAddressId
  ] = useState("");

  const [
    showNewAddress,
    setShowNewAddress
  ] = useState(false);

  const [
    addressLoading,
    setAddressLoading
  ] = useState(true);

  const [
    addressSaving,
    setAddressSaving
  ] = useState(false);

  const [
    addressError,
    setAddressError
  ] = useState("");

  const [
    orderError,
    setOrderError
  ] = useState("");

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    orderSuccess,
    setOrderSuccess
  ] = useState(null);

  const [
    couponCode,
    setCouponCode
  ] = useState("");

  const [
    appliedCoupon,
    setAppliedCoupon
  ] = useState(null);

  const [
    couponError,
    setCouponError
  ] = useState("");

  const [
    couponLoading,
    setCouponLoading
  ] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const shipping =
    subtotal >= 5000
      ? 0
      : 100;

  let discount = 0;

  if (appliedCoupon) {
    if (
      appliedCoupon.type ===
      "percentage"
    ) {
      discount =
        (subtotal *
          Number(appliedCoupon.value)) /
        100;
    }

    if (
      appliedCoupon.type ===
      "fixed"
    ) {
      discount =
        Number(appliedCoupon.value);
    }
  }

  discount = Math.min(
    discount,
    subtotal
  );

  const total =
    subtotal +
    shipping -
    discount;

  const handleApplyCoupon = async () => {
    try {
      setCouponLoading(true);
      setCouponError("");

      const code =
        couponCode
          .trim()
          .toUpperCase();

      if (!code) {
        setAppliedCoupon(null);
        setCouponError(
          "Please enter a coupon code"
        );
        return;
      }

      const coupons =
        await getCouponByCode(code);

      if (coupons.length === 0) {
        setAppliedCoupon(null);
        setCouponError(
          "Invalid coupon code"
        );
        return;
      }

      const coupon = coupons[0];

      if (!coupon.active) {
        setAppliedCoupon(null);
        setCouponError(
          "This coupon is no longer active"
        );
        return;
      }

      if (
        subtotal <
        Number(coupon.minimumOrder)
      ) {
        setAppliedCoupon(null);
        setCouponError(
          `Minimum order value is ₹${coupon.minimumOrder}`
        );
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError("");
    } catch (error) {
      console.error(error);

      setAppliedCoupon(null);

      setCouponError(
        "Unable to apply coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  useEffect(() => {
    async function loadAddresses() {
      if (!user?.id) {
        setAddressLoading(false);
        return;
      }

      try {
        setAddressLoading(true);
        setAddressError("");

        const savedAddresses =
          await getUserAddresses(
            user.id
          );

        setAddresses(
          savedAddresses
        );

        const defaultAddress =
          savedAddresses.find(
            (address) =>
              address.isDefault
          );

        const addressToSelect =
          defaultAddress ||
          savedAddresses[0];

        if (addressToSelect) {
          setSelectedAddressId(
            String(
              addressToSelect.id
            )
          );

          setValue(
            "fullName",
            addressToSelect.fullName
          );

          setValue(
            "address",
            addressToSelect.address
          );

          setValue(
            "city",
            addressToSelect.city
          );

          setValue(
            "pincode",
            addressToSelect.pincode
          );

          setValue(
            "phone",
            addressToSelect.phone
          );

          setShowNewAddress(false);
        } else {
          setShowNewAddress(true);
        }
      } catch (error) {
        console.error(
          "Failed to load addresses:",
          error
        );

        setAddressError(
          "Failed to load saved addresses."
        );

        setShowNewAddress(true);
      } finally {
        setAddressLoading(false);
      }
    }

    loadAddresses();
  }, [
    user?.id,
    setValue
  ]);

  const handleSelectAddress = (
    address
  ) => {
    setSelectedAddressId(
      String(address.id)
    );

    setValue(
      "fullName",
      address.fullName
    );

    setValue(
      "address",
      address.address
    );

    setValue(
      "city",
      address.city
    );

    setValue(
      "pincode",
      address.pincode
    );

    setValue(
      "phone",
      address.phone
    );

    setShowNewAddress(false);

    setAddressError("");
  };

  const handleAddNewAddress = () => {
    setSelectedAddressId("");

    setShowNewAddress(true);

    setValue(
      "fullName",
      ""
    );

    setValue(
      "address",
      ""
    );

    setValue(
      "city",
      ""
    );

    setValue(
      "pincode",
      ""
    );

    setValue(
      "phone",
      ""
    );

    setAddressError("");
  };

  const saveNewAddress = async (
    data
  ) => {
    try {
      setAddressSaving(true);
      setAddressError("");

      const addressData = {
        fullName:
          data.fullName.trim(),

        address:
          data.address.trim(),

        city:
          data.city.trim(),

        pincode:
          data.pincode.trim(),

        phone:
          data.phone.trim()
      };

      const updatedUser =
        await addUserAddress(
          user.id,
          addressData
        );

      const updatedAddresses =
        updatedUser.addresses || [];

      setAddresses(
        updatedAddresses
      );

      const newAddress =
        updatedAddresses[
          updatedAddresses.length - 1
        ];

      if (newAddress) {
        setSelectedAddressId(
          String(
            newAddress.id
          )
        );

        setShowNewAddress(false);
      }

      return newAddress;
    } catch (error) {
      console.error(
        "Failed to save address:",
        error
      );

      setAddressError(
        "Failed to save address. Please try again."
      );

      return null;
    } finally {
      setAddressSaving(false);
    }
  };

  const onSubmit = async (
    data
  ) => {
    if (
      cartItems.length === 0
    ) {
      return;
    }

    setSubmitting(true);
    setOrderError("");

    try {
      let selectedAddress =
        addresses.find(
          (address) =>
            String(address.id) ===
            String(
              selectedAddressId
            )
        );

      if (
        showNewAddress ||
        !selectedAddress
      ) {
        selectedAddress =
          await saveNewAddress(
            data
          );

        if (!selectedAddress) {
          setSubmitting(false);
          return;
        }
      }

      const orderItems =
        cartItems.map(
          (item) => ({
            ...item,
            image:
              productImages[
                item.id
              ] || item.image
          })
        );

      const orderData = {
        userId: user.id,

        customer: {
          fullName:
            selectedAddress.fullName,

          address:
            selectedAddress.address,

          city:
            selectedAddress.city,

          pincode:
            selectedAddress.pincode,

          phone:
            selectedAddress.phone
        },

        payment:
          data.payment,

        items:
          orderItems,

        subtotal,

        shipping,

        discount,

        coupon:
          appliedCoupon
            ? {
                code:
                  appliedCoupon.code,

                type:
                  appliedCoupon.type,

                value:
                  appliedCoupon.value
              }
            : null,

        total,

        orderDate:
          new Date().toISOString(),

        status:
          "Pending"
      };

      const order =
        await createOrder(
          orderData
        );

      for (
        const item of cartItems
      ) {
        const currentStock =
          Number(item.stock);

        const purchasedQuantity =
          Number(item.quantity);

        const newStock =
          Math.max(
            0,
            currentStock -
              purchasedQuantity
          );

        await updateProduct(
          item.id,
          {
            stock: newStock
          }
        );
      }

      dispatch(
        addOrder(order)
      );

      dispatch(
        clearCart()
      );

      setAppliedCoupon(null);
      setCouponCode("");

      setOrderSuccess(
        order
      );
    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      setOrderError(
        "Unable to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (
    cartItems.length === 0 &&
    !orderSuccess
  ) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-4xl">
            🛒
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            NEXUS Checkout
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Add some gaming gear to your cart before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-block rounded-lg bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 py-10 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-green-500/20 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-4xl">
            ✓
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-green-400">
            Order Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Thank you for shopping with NEXUS.
            Your gaming gear is on its way.
          </p>

          <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-sm text-slate-500">
                Order ID
              </span>

              <span className="text-sm font-bold">
                #{orderSuccess.id}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 py-4">
              <span className="text-sm text-slate-500">
                Total
              </span>

              <span className="font-bold text-cyan-400">
                ₹{orderSuccess.total}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-slate-500">
                Status
              </span>

              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
                {orderSuccess.status}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="flex-1 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Continue Shopping
            </Link>

            <Link
              to="/orders"
              className="flex-1 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            NEXUS Checkout
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Complete Your Order
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose your delivery address and preferred payment method.
          </p>
        </section>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-lg">
                    📍
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Select a saved address or add a new one.
                    </p>
                  </div>
                </div>

                {addressLoading ? (
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Loading saved addresses...
                    </p>
                  </div>
                ) : (
                  <>
                    {addresses.length > 0 && (
                      <div className="mt-6 space-y-3">
                        {addresses.map(
                          (
                            address
                          ) => {
                            const isSelected =
                              String(
                                selectedAddressId
                              ) ===
                              String(
                                address.id
                              );

                            return (
                              <button
                                key={
                                  address.id
                                }
                                type="button"
                                onClick={() =>
                                  handleSelectAddress(
                                    address
                                  )
                                }
                                className={`w-full rounded-xl border p-4 text-left transition ${
                                  isSelected
                                    ? "border-cyan-400 bg-cyan-500/5"
                                    : "border-slate-700 bg-slate-950 hover:border-slate-600"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                      isSelected
                                        ? "border-cyan-400 bg-cyan-400"
                                        : "border-slate-600"
                                    }`}
                                  >
                                    {isSelected && (
                                      <span className="text-xs font-black text-slate-950">
                                        ✓
                                      </span>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-bold text-white">
                                        {
                                          address.fullName
                                        }
                                      </p>

                                      {address.isDefault && (
                                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                                          DEFAULT
                                        </span>
                                      )}
                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                      {
                                        address.address
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {
                                        address.city
                                      }{" "}
                                      -{" "}
                                      {
                                        address.pincode
                                      }
                                    </p>

                                    {address.phone && (
                                      <p className="mt-1 text-xs text-slate-500">
                                        {
                                          address.phone
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={
                        handleAddNewAddress
                      }
                      className="mt-4 w-full rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 px-4 py-3 text-sm font-bold text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                    >
                      + Add New Address
                    </button>
                  </>
                )}

                {addressError && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                    <p className="text-xs text-red-400">
                      {addressError}
                    </p>
                  </div>
                )}

                {showNewAddress && (
                  <div className="mt-6 border-t border-slate-800 pt-6">
                    <div className="mb-5">
                      <h3 className="text-sm font-bold">
                        Add New Address
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        This address will be saved to your account.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          Full Name
                        </label>

                        <input
                          type="text"
                          placeholder="Enter your full name"
                          {...register(
                            "fullName",
                            {
                              required:
                                showNewAddress
                                  ? "Full name is required"
                                  : false,
                              pattern: {
                                value:
                                  /^[A-Za-z ]+$/,
                                message:
                                  "Name should contain only letters"
                              }
                            }
                          )}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                        />

                        {errors.fullName && (
                          <p className="mt-2 text-xs text-red-400">
                            {
                              errors.fullName.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          Address
                        </label>

                        <textarea
                          rows="3"
                          placeholder="Enter your full address"
                          {...register(
                            "address",
                            {
                              required:
                                showNewAddress
                                  ? "Address is required"
                                  : false,
                              minLength: {
                                value: 10,
                                message:
                                  "Address must be at least 10 characters"
                              }
                            }
                          )}
                          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                        />

                        {errors.address && (
                          <p className="mt-2 text-xs text-red-400">
                            {
                              errors.address.message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          City
                        </label>

                        <input
                          type="text"
                          placeholder="Enter city"
                          {...register(
                            "city",
                            {
                              required:
                                showNewAddress
                                  ? "City is required"
                                  : false,
                              pattern: {
                                value:
                                  /^[A-Za-z ]+$/,
                                message:
                                  "City should contain only letters"
                              }
                            }
                          )}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                        />

                        {errors.city && (
                          <p className="mt-2 text-xs text-red-400">
                            {
                              errors.city.message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          Pincode
                        </label>

                        <input
                          type="text"
                          placeholder="6 digit pincode"
                          {...register(
                            "pincode",
                            {
                              required:
                                showNewAddress
                                  ? "Pincode is required"
                                  : false,
                              pattern: {
                                value:
                                  /^[0-9]{6}$/,
                                message:
                                  "Pincode must be exactly 6 digits"
                              }
                            }
                          )}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                        />

                        {errors.pincode && (
                          <p className="mt-2 text-xs text-red-400">
                            {
                              errors.pincode.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          Phone Number
                        </label>

                        <input
                          type="text"
                          placeholder="Enter 10 digit phone number"
                          {...register(
                            "phone",
                            {
                              required:
                                showNewAddress
                                  ? "Phone number is required"
                                  : false,
                              pattern: {
                                value:
                                  /^[6-9][0-9]{9}$/,
                                message:
                                  "Enter a valid 10 digit phone number"
                              }
                            }
                          )}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                        />

                        {errors.phone && (
                          <p className="mt-2 text-xs text-red-400">
                            {
                              errors.phone.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-lg">
                    💳
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Payment Method
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose how you want to pay.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-cyan-400/60">
                    <input
                      type="radio"
                      value="cod"
                      {...register(
                        "payment",
                        {
                          required:
                            "Please select a payment method"
                        }
                      )}
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        💵 Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Pay when your order arrives.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-cyan-400/60">
                    <input
                      type="radio"
                      value="online"
                      {...register(
                        "payment",
                        {
                          required:
                            "Please select a payment method"
                        }
                      )}
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        💳 Online Payment
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Pay securely online.
                      </p>
                    </div>
                  </label>
                </div>

                {errors.payment && (
                  <p className="mt-3 text-xs text-red-400">
                    {errors.payment.message}
                  </p>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Review
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Order Summary
                  </h2>
                </div>

                <span className="text-xl">
                  🧾
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {cartItems.map(
                  (item) => {
                    const image =
                      productImages[
                        item.id
                      ] ||
                      item.image;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 border-b border-slate-800 pb-4"
                      >
                        <img
                          src={image}
                          alt={item.name}
                          className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Qty:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-cyan-400">
                          ₹
                          {Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-bold text-white">
                  Have a coupon?
                </p>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) =>
                      setCouponCode(
                        event.target.value.toUpperCase()
                      )
                    }
                    placeholder="Enter coupon code"
                    disabled={
                      couponLoading
                    }
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                  />

                  <button
                    type="button"
                    onClick={
                      handleApplyCoupon
                    }
                    disabled={
                      couponLoading
                    }
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {couponLoading
                      ? "Applying..."
                      : "Apply"}
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                    <p className="text-xs font-semibold text-green-400">
                      ✓{" "}
                      {
                        appliedCoupon.code
                      }{" "}
                      applied
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleRemoveCoupon
                      }
                      className="text-xs font-semibold text-red-400 transition hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-2 text-xs text-red-400">
                    {couponError}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>
                    Subtotal
                  </span>

                  <span className="text-slate-200">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-slate-400">
                  <span>
                    Shipping
                  </span>

                  <span
                    className={
                      shipping === 0
                        ? "font-semibold text-green-400"
                        : "text-slate-200"
                    }
                  >
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>
                      Coupon Discount
                    </span>

                    <span className="font-semibold text-green-400">
                      -₹
                      {discount.toFixed(
                        2
                      )}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                    <p className="text-xs font-semibold text-cyan-400">
                      ✓ Coupon{" "}
                      {
                        appliedCoupon.code
                      }{" "}
                      applied
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-2xl font-black text-cyan-400">
                      ₹
                      {total.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {subtotal < 5000 ? (
                <div className="mt-5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-3">
                  <p className="text-xs leading-5 text-cyan-400">
                    🚚 Add{" "}
                    <span className="font-bold">
                      ₹
                      {5000 -
                        subtotal}
                    </span>{" "}
                    more for FREE shipping.
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-green-500/10 bg-green-500/5 p-3">
                  <p className="text-xs font-semibold text-green-400">
                    ✓ Free shipping unlocked!
                  </p>
                </div>
              )}

              {orderError && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <p className="text-xs leading-5 text-red-400">
                    {orderError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  addressLoading ||
                  addressSaving
                }
                className="mt-6 w-full rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ||
                addressSaving
                  ? "Placing Order..."
                  : "Place Order →"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-600">
                🔒 Your order information is securely processed.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;