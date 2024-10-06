class ProductDto {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.image = product.imageUrl;
    this.category = product.category;
    this.resturant = product.resturantId;
    this.modifiers = product.modifiers;
  }
}
module.exports = ProductDto;
