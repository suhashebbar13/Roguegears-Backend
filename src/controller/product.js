const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const asyncHandler = require('express-async-handler'); 
const { Result } = require("express-validator");


exports.createProduct = (req, res) => {
  // res.status(200).json( { file: req.files, body: req.body } );

  const { name, price, description,otherDescription, category, quantity, offer, createdBy,reviews} = req.body;
  let productPictures = [];
  console.log(otherDescription)
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  console.log(otherDescription)
  const parsedOtherDescription = JSON.parse(otherDescription);
  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    offer,
    description,
    otherDescription: parsedOtherDescription,
    productPictures,
    category,
    createdBy,
    reviews
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.createProductReview =  asyncHandler(async(req, res) => {
  const { rating, comment } = req.body
  const products = await Product.findById(req.params.slug)

  if (products) {
    // const alreadyReviewed = products.reviews.find(
    //   (r) => r.user.toString() === req.user._id.toString()
    // )

    // if (alreadyReviewed) {
    //   res.status(400)
    //   throw new Error('Product already reviewed')
    // }

    const review = {
      name: req.user._doc.firstName + ' ' + req.user._doc.lastName,
      rating: rating,
      comment,
      user: req.user._id,
    }

    products.reviews.push(review)

    products.numReviews = products.reviews.length

    products.rating =
      products.reviews.reduce((acc, item) => item.rating + acc, 0) 
      products.reviews.length

      await products.save()
    res.status(201).json( products )
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

  
  // if(productId){
  //   Product.findById({_id:productId}, userID, review).exec((error, product) => {
  //     if (error) return res.status(400).json({ error });
  //     if (product) {
  //       res.status(200).json({ product });
  //     }
  //   });
  // }

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findById({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.deleteReviewsById = (req,res) =>{
  const { reviewId,id } = req.body.payload;
  const ser = /"(.*?)"/
  // const products = await Product.findById(req.params.slug)
  if (id) {
    Product.findById(id, function (err, result) {
      if (err) return handleError(err);
      const updated = result.reviews.filter(rev =>  rev._id.toString()!==reviewId )
      result.reviews = updated
      result.save();
      res.status(202).json(result);
  });


    // Product.findByIdAndUpdate(id, reviews.map((rev)=>{
    //   rev._id===reviewId ? rev._id="": rev._id
    // }), { new: true },(error, result) => {
    //   if (error) return res.status(400).json({ error });
    //   if (result) {
    //     console.log("Inside review delete",result)
    //     res.status(202).json(result);
    //   }
    // });
  } else {
    res.status(400).json({ error: "Params required by frontend" });
  }
}

exports.getProducts = async (req, res) => {
  const products = await Product.find({ role: 'super-admin' })
    .select("_id name price offer quantity slug description otherDescription productPictures category reviews")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};