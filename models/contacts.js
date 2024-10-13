const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");




const contactsPath = path.join(__dirname, "contacts.json");
console.log("MyPath:",contactsPath);

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.error("Error reading contacts file!", error);
    throw error;
  }
}
listContacts();
async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const contactFound = contacts.find((contact) => contact.id === contactId);   
    return contactFound || null;
  } catch (error) {
    console.error("Error reading file!", error);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const indexContact = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (indexContact === -1) {
      console.log(`Contact with ID ${contactId} not found`);
      return false;
    }
     contacts.splice(indexContact, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return true;
  } catch (error) {
    console.error("Error handling contacts file!", error);
    throw error;
  }
}

async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    console.error("You need to provide a name, email, and phone.");
    return;
  }
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const uniqueId = crypto.randomUUID();
    const newContact = { id: uniqueId, name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("The contact is added!", newContact);
     return newContact;
    
  } catch (error) {
    console.error("Error reading contacts file!", error);
    throw error;
  }
}



const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const indexContact = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (indexContact === -1) {
      console.log(`Contact with ID ${contactId} not found`);
      return false;
    }

   
    contacts[indexContact] = { ...contacts[indexContact], ...body };

  
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(`Contact with ID ${contactId} was successfully updated.`);
    return contacts[indexContact];
  } catch (error) {
    console.error("Error updating contact", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
