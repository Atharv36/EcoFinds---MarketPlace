import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createOrderController,
  getOrdersController,
  getOrderController,
  updateOrderController,
  deleteOrderController
} from '../controllers/order.controller.js';

const orderRouter = express.Router();

// Create order
orderRouter.post('/create', verifyToken, createOrderController);

// Get all orders
orderRouter.get('/get', verifyToken, getOrdersController);

// Get order by ID
orderRouter.get('/get/:id', verifyToken, getOrderController);

// Update order
orderRouter.put('/update/:id', verifyToken, updateOrderController);

// Delete order
orderRouter.delete('/delete/:id', verifyToken, deleteOrderController);

export default orderRouter;
