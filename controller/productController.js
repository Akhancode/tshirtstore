const BigPromise = require('../middleware/bigPromise')
const Product = require('../models/product')
const CustomError = require('../utils/customError')
const cloudinary = require('cloudinary')
const WhereClause = require('../utils/whereClause')


//BIG PROMISE
exports.testproduct = BigPromise(
  async  (req,res)=>{
    //const db = await something
    res.status(200).json({
        success:true,
        greeting:"Hello tesst product route"
    })}
    )
exports.addproduct = BigPromise( async  (req,res,next)=>{
  
  //IMAGE UPLOADING TO CLOUDINARY
  let imageArray = []
  
  if(!req.files){
    return next(new CustomError("Images are required"))
  }
  if(req.files){
    for (let index = 0; index < req.files.photos.length; index++) {
      
      let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
        folder:"products"
      })
      imageArray.push({
        id:result.public_id,
          secure_url : result.secure_url
        })
      }
    }
    
    req.body.photos = imageArray
    req.body.user = req.user.id
    
    //DATA OF PRODUCT
    const product = await Product.create(req.body)
    
    
    //const db = await something
    res.status(200).json({
      success:true,
      greeting:" create product route"
    })}
    )

exports.getAllProduct = BigPromise( async  (req,res,next)=>{
  const resultperpage = 4;
  const totalcountProduct = await Product.countDocuments()
  

  // const products = Product.find({})
  const productsObject =new WhereClause(Product.find(),req.query).search().filter()
  let products = productsObject.base
  const filteredProductNumber = products.length


  productsObject.pager(resultperpage )

  products = await productsObject.base

  res.status(200).json({
    success:true,
    products,
    filteredProductNumber,
    totalcountProduct
  })
})

exports.adminGetAllProduct = BigPromise( async  (req,res,next)=>{
  const products =await  Product.find()
  
  res.status(200).json({
    success:true,
    products,
    })
})

exports.getSingleProduct = BigPromise( async  (req,res,next)=>{
  const product =await  Product.findById(req.params.id)
  
  if(!product){
    return next(new CustomError("no product found from this id ",401))
  }
  res.status(200).json({
    success:true,
    product,
    })
})
exports.adminSingleProduct = BigPromise( async  (req,res,next)=>{
  const product = await Product.findById(req.params.id)

  if(!product){
    return next(new CustomError("no product found from this id ",401))
  }

  res.status(200).json({
    success:true,
    product,
    })
})
exports.adminUpdateProduct = BigPromise( async  (req,res,next)=>{
  let product =await  Product.findById(req.params.id)
  let imageArray = []

  if(!product){
    return next(new CustomError("no product found from this id ",401))
  }
  
  if(req.files){
    //destroy existing images
    for (let index = 0; index < product.photos.length; index++) {
      const result = await cloudinary.v2.uploader.destroy(product.photos[index].id)
    }
    //upload and save new images
    for (let index = 0; index < req.files.photos.length; index++) {
      
      let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
        folder:"products"
      })
      imageArray.push({
        id:result.public_id,
          secure_url : result.secure_url
        })
      }
    
  }
  req.body.photos = imageArray
  req.body.user = req.user.id

  product = await Product.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })

  res.status(200).json({
    success:true,
    product,
    })
})
exports.adminDeleteProduct = BigPromise( async  (req,res,next)=>{
  const product =await  Product.findById(req.params.id)
  let imageArray = []

  if(!product){
    return next(new CustomError("no product found from this id ",401))
  }
  //destroy existing images
  for (let index = 0; index < product.photos.length; index++) {
    const result = await cloudinary.v2.uploader.destroy(product.photos[index].id)
  }
  
  
  await product.remove()

  res.status(200).json({
    success:true,
    message:`Product was ${product.name} deleted from DB and Cloudinary`
    })
})

exports.addReview = BigPromise( async  (req,res,next)=>{

  const {rating ,comment,productID} = req.body
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product =await  Product.findById(productID)
  
  const IsAlreadyReview =product.reviews.find(
    (review)=>review.user.toString() === req.user._id.toString()
  )
  if(IsAlreadyReview){

    product.reviews.forEach((review)=>{
      if(review.user.toString() === req.user._id.toString()){
        review.comment = comment,
        review.rating = rating
      }
    })

  }else{
    product.reviews.push(review)
    product.number_of_review =product.reviews.length
  }
  //CALCULATE average rating and assigning it to product
  product.rating = product.reviews.reduce((acc,item)=>item.rating + acc , 0)/(product.reviews.length)

  await product.save({validateBeforeSave:false})
  res.status(200).json({
    success:true,
    message: `"added comment to product : ${product.name}`,
    })
})
exports.deleteReview = BigPromise( async  (req,res,next)=>{
  
  const {productID} = req.body
  
  
  const product =await  Product.findById(productID)
  


  //FILTER REVIEW WHICH current user  REVIEW
  const reviews =  product.reviews.filter((review)=>{
 
    return review.user.toString() !== req.user._id.toString()
  })
  
  
  const number_of_review = reviews.length


  //CALCULATE average rating and assigning it to product
  const rating =  reviews.reduce((acc,item)=>item.rating + acc , 0)/(reviews.length)

  // update the product
    await Product.findByIdAndUpdate(productID,{
      reviews,
      rating,
      number_of_review
    },{
      new:true,
      runValidators:true,
      useFindAndModify:false
    })
  res.status(200).json({
    success:true,
    message: `"delete comment to product : ${product.name}`,
  })
})
exports.getOnlyReviewsOfSingleProduct = BigPromise( async  (req,res,next)=>{
  const product= await Product.findById(req.params.id)

  res.status(200).json({
    success:true,
    reviews : product.reviews
  })
})