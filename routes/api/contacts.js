const express = require('express');
const { listContacts, addContact, removeContact, getContactById, updateContact } = require('../../models/contacts');
const crypto = require("crypto");
const Joi = require("joi");


const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    console.log(contacts);
    res.status(200).json({
      status: "success",
      code: 200,
      data: contacts,

    })
    
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error loading  list contacts!"
    })
    
  }
});

router.get("/:contactId", async (req, res) => {
  const { id } = req.params; 

  try {
    const contact = await getContactById(id); 
    if (contact) {
      return res.status(200).json(contact); 
    } else {
      return res.status(404).json({ message: "Not found" }); 
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to get contact" }); 
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name) {
    return res.status(400).json({ message: "missing required name field" });
  }
  if (!email) {
    return res.status(400).json({ message: "missing required email field" });
  }
  if (!phone) {
    return res.status(400).json({ message: "missing required phone field" });
  }
  try {
    const id = crypto.randomUUID();
    const newContact = { id, name, email, phone };
    await addContact(newContact);
    res.status(201).json(newContact);
    console.log("Contacts successfully updated in contacts.json");
    
  } catch (error) {
     res.status(500).json({
       status: "error",
       code: 500,
       message: "Error adding new contact!",
     });
  }
  
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await removeContact(id);
    if (result) {
      return res.status(200).json({ message: "contact deleted" });
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact" });
  }
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9-]+$/),
}).or("name", "email", "phone"); 

router.put("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

 
  const { error } = updateSchema.validate(body);
  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }

  try {
  
    const updatedContact = await updateContact(id, body);
   
    if (updatedContact) {
      return res.status(200).json(updatedContact);
    } else {
   
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to update contact" });
  }
});

module.exports = router
