class ResturantDTO {
  constructor(data) {
    this._id = data._id;
    this.name = data.name;
    this.whatsapp = data.whatsapp;
    this.categories = data.productCategories;
  }
}

module.exports = ResturantDTO;
