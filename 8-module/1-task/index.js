import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
    this.initialTopCoord = null;
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {

    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
      this.updatePosition();

      this.elem.classList.add('shake');

      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    let cart = this.elem;
    let cartIsHidden = this.isHidden(cart);

    if (cartIsHidden) {
      return;
    }

    if (window.pageYOffset > this.elem.getBoundingClientRect().top + window.pageYOffset && document.documentElement.clientWidth > 767) {
      Object.assign(this.elem.style, {
        position: 'fixed',
        top: '50px',
        zIndex: 1e3,
        right: '10px',
        left: Math.min(
          document.querySelector('.container').getBoundingClientRect().right + 20,
          document.documentElement.clientWidth - this.elem.offsetWidth - 10
        ) + 'px'
      });
    }

    //обнуляем позинионирование корзины при скролле к началу страницы
    if (window.pageYOffset <= 50) {
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: ''
      });
    }
  }

  isHidden(elem) {
    return !elem.offsetWidth && !elem.offsetHeight;
  }

}
