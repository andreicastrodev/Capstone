const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  data: {
    inquiry: [{
      inquiryId: {
        type: Schema.Types.ObjectId,
        ref: 'Inquiry',
        required: true
      }
    }]
  }
});

userSchema.methods.addInquiry = function (inquiry) {

  const updatedInquiries = [...this.data.inquiry];

  updatedInquiries.push({
    inquiryId: inquiry._id
  })
  const updatedData = {
    inquiry: updatedInquiries
  }
  this.data = updatedData
  return this.save();
}


userSchema.methods.removeInquiry = function(inquiryId){

  // find the inquiry in the data that has the same id
  const updatedInquiry = this.data.inquiry.filter(inquiry =>{
    return inquiry.inquiryId.toString() !== inquiryId.toString();
  })
  this.data.inquiry = updatedInquiry;
  return this.save();
  //remove
  //save
}
// userSchema.methods.removeFromCart = function(productId) {
//   const updatedCartItems = this.cart.items.filter(item => {
//     return item.productId.toString() !== productId.toString();
//   });
//   this.cart.items = updatedCartItems;
//   return this.save();
// };



// userSchema.methods.addToCart = function (product) {
//   const cartProductIndex = this.cart.items.findIndex(cp => {
//     return cp.productId.toString() === product._id.toString();
//   });
//   let newQuantity = 1;
//   const updatedCartItems = [...this.cart.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   } else {
//     updatedCartItems.push({
//       productId: product._id,
//       quantity: newQuantity
//     });
//   }
//   const updatedCart = {
//     items: updatedCartItems
//   };
//   this.cart = updatedCart;
//   return this.save();
// };

module.exports = mongoose.model('User', userSchema);