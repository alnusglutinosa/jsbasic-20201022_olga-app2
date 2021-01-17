import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    let isNew = 1;
    let cartItem = {};

    for (let item of this.cartItems) {
      if (item.product.id === product.id) {
        item.count++;
        cartItem = item;
        isNew = 0;
        break;
      }
    }

    if (isNew) {
      cartItem = {product: product, count: 1};
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(cartItem);
   }

  updateProductCount(productId, amount) {
    let cartItem = {};

    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id !== productId) continue;
      this.cartItems[i].count = this.cartItems[i].count + amount;
      cartItem = this.cartItems[i];

      if (this.cartItems[i].count >= 1) break;

      this.cartItems.splice(i, 1);
      break;
    }

    this.onProductUpdate(cartItem);

  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;

    for (let item of this.cartItems) {
      totalCount += item.count;
    };

    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;

    for (let item of this.cartItems) {
      totalPrice += item.count * item.product.price;
    };

    return totalPrice;
  }

  renderProduct(product, count) {
    return `
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`;
  }

  renderOrderForm() {
    return `<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`;
  }

  renderModal() {
    let modal = new Modal();
    modal.setTitle('Your order');

    let body = document.createElement('div');
    let productsList = this.cartItems.map((el) => {
      return this.renderProduct(el.product, el.count);
    })
    .join('');

    let orderForm =  this.renderOrderForm();

    body.innerHTML =  `
      ${productsList}
      ${orderForm}
    `;

    body.addEventListener('click', (event) => {
      if (!event.target.closest(".cart-counter__button")) return;

      if (event.target.closest(".cart-counter__button").classList.contains("cart-counter__button_minus")) {
        this.updateProductCount(event.target.closest(".cart-product").dataset.productId, -1);
        if (!this.getTotalCount()) modal.close();
      }

      if (event.target.closest(".cart-counter__button").classList.contains("cart-counter__button_plus")) {
        this.updateProductCount(event.target.closest(".cart-product").dataset.productId, 1);
      }
    });

    let form = body.querySelector(".cart-form");

    form.addEventListener('submit', (e) => this.onSubmit(e));

    modal.setBody(body);
    modal.open();
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!document.querySelector("body").classList.contains('is-modal-open')) return;

    let modalBody = document.querySelector('.modal');
    if (!modalBody) return;
    let productId = cartItem.product.id;
    let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

    productCount.innerHTML = cartItem.count;

    productPrice.innerHTML = `€${(cartItem.count*cartItem.product.price).toFixed(2)}`;

    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

  }

  async onSubmit(event) {
    event.preventDefault();

    let modal = document.querySelector(".modal");
    let modalBody = modal.querySelector(".modal__body");
    let modalTitle= modal.querySelector(".modal__title")
    let form = modal.querySelector(".cart-form");
    let submitButton = form.querySelector("button[type='submit']");
    submitButton.classList.add('is-loading');

    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(form)
    });

    this.cartItems = [];
    this.cartIcon.update(this);
    modalBody.innerHTML = `<div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="/assets/images/delivery.gif">
      </p>
    </div>`;
    modalTitle.innerHTML = `Success!`;
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => {
      this.renderModal();
    }
  }

}
