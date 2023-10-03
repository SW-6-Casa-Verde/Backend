const mongoose = require('mongoose');
const UserSchema = require('./schemas/user');
const CategorySchema = require('./schemas/category');
const ItemSchema = require('./schemas/item');
const OrderSchema = require('./schemas/order');
const OrderItemSchema = require('./schemas/orderItem');

exports.User = mongoose.model('User', UserSchema);
exports.Category = mongoose.model('Category', CategorySchema);
exports.Item = mongoose.model('Item', ItemSchema);
exports.Order = mongoose.model('Order', OrderSchema);
exports.OrderItem = mongoose.model('OrderItem', OrderItemSchema);