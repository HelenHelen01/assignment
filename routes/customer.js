const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/protect');
const { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer } = require('../controller/customer-controller');

// /api/v1/customers
router.route('/').get(getCustomers);
router.use(protect);
router.route('/').post(createCustomer)
  .put(updateCustomer)
  .delete(authorize(), deleteCustomer);

router.route('/:id').get(getCustomer);

module.exports = router;
