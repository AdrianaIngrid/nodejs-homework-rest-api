const services = require("../services/index");

const getAllContacts = async (_, res, next) =>{
    try {
        const results = await services.listContacts();
        res.json({
            status: "success",
            code: 200,
            data: {contacts: results},
        });
    } catch (error) {
       next(error);        
    }
};
const createContact = async (req, res, next) => {
    try {
        const { name, email, phone, favorite } = req.body;
        const result = await services.addContact({ name, email, phone, favorite });
        res.status(201).json({
            status: "success",
            code: 201,
            data: { contacts: result },
        });
    } catch (error) {        
     next(error);
        };        
    }

    const deleteContact = async (req, res, next) => {
        const { contactId } = req.params;
        try {
            const contact = await services.removeContact(contactId);
            if (!contact) {
                return res.status(404).json({ message: "Contact not found!" });
            }
            res
              .status(200)
              .json({
                status: "success",
                code: 200,
                message: `Contact with id ${contactId} deleted`,
              });
        } catch (error) {
            next(error);
        }
        
    }       
    const updateExistingContact = async (req, res) => {
      const { contactId } = req.params;
      try {
        const updatedContact = await services.updateContact(contactId, req.body);
        if (!updatedContact) {
          return res.status(404).json({ message: "Contact not found" });
        }
          res.status(200).json({
              status: "success",
              code:200,
             data: {contacts: updatedContact }, 
          });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
const getContactById = async (req, res, next) => {
    const {contactId} = req.params;
  // console.log(id);

  try {
    const contact = await services.getContactById(contactId);
    // console.table(contact);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact with id: ${contactId} does not exists...!`,
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: `Contact with id: ${contactId}} was found !`,
        data: { contact },
    });
  } catch (error) {

    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  
  if (favorite === undefined) {
    return res.status(400).json({
      message: "missing field favorite",
    });
  }

  try {
  
    const updatedContact = await services.favoriteContact(contactId, favorite);

    
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

   
    res.status(200).json({
      status: "success",
      code: 200,
      data: { contact: updatedContact },
    });
  } catch (error) {
    next(error); 
  }
};

    module.exports = {
        getAllContacts,
        createContact,
        deleteContact,
        updateExistingContact,
        getContactById,
        updateStatusContact
    };