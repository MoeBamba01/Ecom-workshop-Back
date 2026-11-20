const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true,
        },
        items : [ 
            {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required : true,
            },
            name : String,
                price : Number,
                quantity : {
                    type : Number,
                    required : true,
                    min : 1,
                },
            },
        ],

        shippingAddress : {
            type : String,
            required : true,
        },

        totalPrice : {
            type : Number,
            required : true,
        },

        status : {
            type : String,
            enum : ["en attente", "payee", "expediee", "livree"],
            default : "en attente",
        },
    },
    { timestamps : true }   
);


module.exports = mongoose.model("Order", orderSchema);