export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    let hasCartItem = this.cartItems.find(item => item.product.id === product.id);

    if (hasCartItem === undefined) {
      let cartItem = {};
      cartItem.product = product;
      cartItem.count = 1;
      this.cartItems.push(cartItem);
      this.onProductUpdate(cartItem);
    }

    if (hasCartItem !== undefined) {
      let cartItemCountIncrease = this.cartItems.find(item => item.product.id === product.id);
      cartItemCountIncrease.count = cartItemCountIncrease.count + 1;
      this.onProductUpdate(cartItemCountIncrease);
    }
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(item => item.product.id === productId);
    cartItem.count += amount;

    if (cartItem.count === 0) {
      let cartIndex = this.cartItems.findIndex(item => item.product.id === productId);
      this.cartItems.splice(cartIndex, 1);
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0 ? true : false
  }

  getTotalCount() {
    return this.cartItems.reduce((acc, currentItem) => {
      return acc + currentItem.count;
    }, 0)
  }

  getTotalPrice() {
    return this.cartItems.reduce((acc, currentItem) => {
      return acc + currentItem.product.price * currentItem.count;
    }, 0)
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
  }
}
