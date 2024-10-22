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

  toWhatsAppMessage() {
    const itemsFormatted = this.items
      .map((item, index) => {
        const modifiersFormatted = item.modifiers
          .filter((modifier) => modifier.name)
          .map((modifier) => modifier.name)
          .join(", ");

        return `${index + 1}. Product: ${item.product}\n   Quantity: ${
          item.quantity
        }\n   Price: $${item.price.toFixed(2)}\n   Modifiers: ${
          modifiersFormatted || "None"
        }`;
      })
      .join("\n\n");

    return `*Order ID*: ${this.id}\n*Customer*: ${this.name}\n*Phone*: ${
      this.phone
    }\n*Address*: ${this.address}\n*Status*: ${
      this.status
    }\n\n*Items*:\n${itemsFormatted}\n\n*Total*: $${this.total.toFixed(
      2
    )}\n*Ordered At*: ${new Date(this.ordered_at).toLocaleString()}`;
  }
}
module.exports = OrderDTO;
