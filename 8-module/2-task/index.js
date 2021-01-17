import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = document.createElement('div');
    this.elem.classList.add('products-grid');
    this.elem.insertAdjacentHTML('afterbegin', `<div class='products-grid__inner'></div>`);
    this.render(products);
  }

  render(data) {
    for (let i = 0; i < data.length; i++) {
      let gridInnerContent = new ProductCard(data[i]).elem;

      this.elem.querySelector('.products-grid__inner').append(gridInnerContent);
    }
  }

  updateFilter(filters) {
    this.filters = Object.assign(this.filters, filters)

    let noNuts = this.filters.noNuts;
    let vegeterianOnly = this.filters.vegeterianOnly;
    let maxSpiciness = this.filters.maxSpiciness;
    let category = this.filters.category;

    let result = this.products.filter((item) =>
      (!noNuts || item.nuts !== true) &&
      (!vegeterianOnly || item.vegeterian  === true) &&
      (maxSpiciness === undefined || item.spiciness  <= maxSpiciness) &&
      (!category || category === '' || item.category === category)
    );

    this.elem.querySelector('.products-grid__inner').innerHTML = '';
    this.render(result);
  }
}
