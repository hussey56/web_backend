class OrderDTO {
  constructor(order) {
    this.id = order._id;
    this.name = order.customer_name;
    this.phone = order.phone_number;
    this.total = order.total_price;
    this.address = order.shipping_address;
    this.status = order.status;
    this.items = order.order_items;
    this.ordered_at = order.createdAt;
  }
}
module.exports = OrderDTO;
