const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({ role: 'super-admin' })
    .select("_id name price offer quantity slug description otherDescription productPictures category reviews")
    .populate({ path: "category", select: "_id name" })
    .exec();
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  res.status(200).json({
    categories: createCategories(categories),
    products,
    orders,
  });
};