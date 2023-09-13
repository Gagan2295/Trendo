const  mongoose  = require("mongoose");

const productSchema = new mongoose.Schema({

    product_name: {
		type: String,
		require: true
	},
    price:{
        type: Number,
        require:true
    },
    discount_price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    image: {
        type: String,
        required: true,
      }
});

const Product = mongoose.model("Add_product",productSchema,"Add_product");
module.exports=Product;
