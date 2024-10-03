const User = require("./User");
const Order = require("./Order");
const OrderDetail = require("./DetailOrder");
const Product = require("./Product");
const Status = require("./Status");
const Category = require("./Category");

exports.relations = ()=>{

    User.hasMany(Order, { foreignKey: 'user_id' });
    Order.belongsTo(User, { foreignKey: 'user_id' }); // relación inversa
    
    Status.hasMany(Order, { foreignKey: 'status_id' });
    Order.belongsTo(Status, { foreignKey: 'status_id' }); // relación inversa
    
    Product.hasMany(OrderDetail, { foreignKey: 'product_id' });
    OrderDetail.belongsTo(Product, { foreignKey: 'product_id' }); // relación inversa
    
    Order.hasMany(OrderDetail, { foreignKey: 'order_id' });
    OrderDetail.belongsTo(Order, { foreignKey: 'order_id' }); // relación inversa
    
    Category.hasMany(Product, { foreignKey: "category_id" });
    Product.belongsTo(Category, { foreignKey: 'category_id' }); // relación inversa
}
    