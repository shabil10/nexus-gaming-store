import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const createUser = async (
  userData
) => {
  const response = await axios.post(
    `${API_URL}/users`,
    userData
  );

  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`
  );

  return response.data;
};

export const getUserById = async (
  id
) => {
  const response = await axios.get(
    `${API_URL}/users/${id}`
  );

  return response.data;
};

export const updateUser = async (
  id,
  userData
) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}`,
    userData
  );

  return response.data;
};

export const getUserAddresses = async (
  userId
) => {
  const user =
    await getUserById(userId);

  let addresses =
    user.addresses || [];

  if (
    addresses.length === 0 &&
    user.address &&
    (
      user.address.fullName ||
      user.address.address ||
      user.address.city ||
      user.address.pincode
    )
  ) {
    addresses = [
      {
        id: "default-address",
        fullName:
          user.address.fullName || "",
        address:
          user.address.address || "",
        city:
          user.address.city || "",
        pincode:
          user.address.pincode || "",
        phone:
          user.phone || "",
        isDefault: true
      }
    ];
  }

  return addresses;
};

export const addUserAddress = async (
  userId,
  address
) => {
  const user =
    await getUserById(userId);

  let addresses =
    user.addresses || [];

  if (
    addresses.length === 0 &&
    user.address &&
    (
      user.address.fullName ||
      user.address.address ||
      user.address.city ||
      user.address.pincode
    )
  ) {
    addresses = [
      {
        id: "default-address",
        fullName:
          user.address.fullName || "",
        address:
          user.address.address || "",
        city:
          user.address.city || "",
        pincode:
          user.address.pincode || "",
        phone:
          user.phone || "",
        isDefault: true
      }
    ];
  }

  const updatedAddresses =
    addresses.map(
      (existingAddress) => ({
        ...existingAddress,
        isDefault: false
      })
    );

  const newAddress = {
    id: Date.now().toString(),
    fullName:
      address.fullName,
    address:
      address.address,
    city:
      address.city,
    pincode:
      address.pincode,
    phone:
      address.phone,
    isDefault: true
  };

  updatedAddresses.push(
    newAddress
  );

  const updatedUser =
    await updateUser(
      userId,
      {
        addresses:
          updatedAddresses
      }
    );

  return updatedUser;
};

export const setDefaultUserAddress =
  async (
    userId,
    addressId
  ) => {
    const user =
      await getUserById(userId);

    const addresses =
      user.addresses || [];

    const updatedAddresses =
      addresses.map(
        (address) => ({
          ...address,
          isDefault:
            String(address.id) ===
            String(addressId)
        })
      );

    const updatedUser =
      await updateUser(
        userId,
        {
          addresses:
            updatedAddresses
        }
      );

    return updatedUser;
  };

export const deleteUserAddress =
  async (
    userId,
    addressId
  ) => {
    const user =
      await getUserById(userId);

    const addresses =
      user.addresses || [];

    const updatedAddresses =
      addresses.filter(
        (address) =>
          String(address.id) !==
          String(addressId)
      );

    const updatedUser =
      await updateUser(
        userId,
        {
          addresses:
            updatedAddresses
        }
      );

    return updatedUser;
  };