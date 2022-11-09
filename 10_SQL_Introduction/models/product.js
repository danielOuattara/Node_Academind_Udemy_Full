const db = require("./../utils/database");

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static deleteById(id) {
    return db.execute(
      "DELETE FROM `academind_node_express_udemy_mysql`.`products` WHERE `id` = ?",
      [id]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
    /* return the entiere promise to be used somewhere else; so not .then() .catch() here */
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id= ?", [id]);
  }

  static updatedById(data) {
    const { productId, title, imageUrl, price, description } = data;
    return db.execute(
      `UPDATE products 
       SET title= ?, imageUrl= ?, price= ?, description= ? 
       WHERE 
        id= ?`,
      [title, imageUrl, price, description, productId]
    );
  }
};
