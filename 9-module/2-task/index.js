import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    let body = document.querySelector("body");

    let carousel = new Carousel(slides);
    let carouselContainer  = body.querySelector('[data-carousel-holder]');
    carouselContainer.append(carousel.elem);

    let ribbon = new RibbonMenu(categories);
    let ribbonContainer  = body.querySelector('[data-ribbon-holder]');
    ribbonContainer.append(ribbon.elem);

    let stepSlider = new StepSlider({
      steps: 5,
      value: 3
    });
    let sliderContainer  = body.querySelector('[data-slider-holder]');
    sliderContainer.append(stepSlider.elem);

    let cartIcon = new CartIcon(categories);
    let cartContainer  = body.querySelector('[data-cart-icon-holder]');
    cartContainer.append(cartIcon.elem);

    let cart = new Cart(cartIcon);

    let response = await fetch('products.json', {
      method: 'GET',
    });

    let result = await response.json();
    let productsGrid = new ProductsGrid(result);
    let gridContainer  = body.querySelector('[data-products-grid-holder]');
    gridContainer.innerHTML = "";
    gridContainer.append(productsGrid.elem);

    productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: stepSlider.value,
      category: ribbon.value
    });

    body.addEventListener('product-add', (event) => {
      let added = [];
      for (let product of result) {
        if (product.id === event.detail) added = product;
      }
      cart.addProduct(added);
    });

    sliderContainer.addEventListener('slider-change', (event) => {
      productsGrid.updateFilter({
        maxSpiciness: event.detail
      });
    });

    ribbonContainer.addEventListener('ribbon-select', (event) => {
      productsGrid.updateFilter({
        category: event.detail
      });
    });

    let nutsCheckbox = body.querySelector('#nuts-checkbox');
    nutsCheckbox.addEventListener('change', (event) => {
      productsGrid.updateFilter({
        noNuts: event.target.checked
      });
    });

    let vegeterianCheckbox = body.querySelector('#vegeterian-checkbox');
    vegeterianCheckbox.addEventListener('change', (event) => {
      productsGrid.updateFilter({
        vegeterianOnly: event.target.checked
      });
    });

  }
}
