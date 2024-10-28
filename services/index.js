const Contact = require("./schemas/contactSchema");
const User = require("./schemas/userSchema");
const bcrypt = require("bcrypt");
// Contacts 
const listContacts = async () => {
  return Contact.find();
};
const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

const addContact = async ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite });
};
const removeContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};

const updateContact = async (contactId, fields) => {
  return Contact.findByIdAndUpdate(contactId, fields, { new: true });
};
const favoriteContact = async (contactId, favorite) => {
  return Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
};
// Users
const getAllUsers = async () => {
  return User.find();
};
const createUser = async ({ email, password }) => {
 
  const userExistent = await User.findOne({ email });

  if (userExistent) {
    const error = new Error("Acest email există deja.");
    error.statusCode = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
    subscription: "starter",
  });

   return await newUser.save();

};
const checkUserDB = async ({ email, password }) => {
  try {
    console.log(`Parola:${password}`);
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      throw new Error("Email sau parola gresita!");
    }

    return user;
  } catch (error) {
    console.error("Eroare la verificarea utilizatorului:", error.message);
    throw error;
  }
};


module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  favoriteContact,
  createUser,
  getAllUsers,
  checkUserDB,
};
