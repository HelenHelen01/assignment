const express = require('express');
const { getContacts, createContact, updateContact, deleteContact, getContact } = require('../controller/contact-controller');
const { protect, authorize } = require('../middleware/protect');
const router = express.Router();

// /api/v1/contacts
router.route('/').get(getContacts);
router.use(protect);
router.route('/').post(createContact)
  .put(updateContact)
  .delete(authorize(), deleteContact);

router.route('/:id').get(getContact);


module.exports = router;
