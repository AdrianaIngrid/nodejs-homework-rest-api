const Contact = require("./schemas/contactSchema");
const listContacts = async () =>{
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
const favoriteContact = async ( contactId, favorite ) => {
  return Contact.findByIdAndUpdate(
    contactId, { favorite }, { new: true }
  );
};










module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  favoriteContact,
};