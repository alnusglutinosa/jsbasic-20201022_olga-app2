import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.elem = this.render(categories);
  }

  render(categories) {
    let menu = createElement(`
      <div class="ribbon">
        <!--Кнопка прокрутки влево-->
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>

        <!--Ссылки на категории-->
        <nav class="ribbon__inner">
          ${this.getMenuItems(categories)}
        </nav>

        <!--Кнопка прокрутки вправо-->
        <button class="ribbon__arrow ribbon__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>`);

      this.setActiveMenu(menu);
      this.setArrow(menu);

      const ribbonInner = menu.querySelector('.ribbon__inner');

      menu.addEventListener('click', (event) => {
        const menuItem = event.target.closest('.ribbon__item');
        if (menuItem) {
          event.preventDefault();

          menu.dispatchEvent(
            new CustomEvent('ribbon-select', {
              detail: menuItem.dataset.id,
              bubbles: true,
            })
          );

          this.setActiveMenu(menu, menuItem);
        }
      });

      const arrowLeft = menu.querySelector('.ribbon__arrow_left');
      arrowLeft.addEventListener('click', () => {
          this.scrollRibbonInner(ribbonInner, -1);
      });

      const arrowRight = menu.querySelector('.ribbon__arrow_right');
      arrowRight.addEventListener('click', () => {
          this.scrollRibbonInner(ribbonInner, 1);
      });

      ribbonInner.addEventListener('scroll', () => {
        this.setArrow(menu);
      });

    return menu;
  }

  scrollRibbonInner(elem, direction) {
    elem.scrollBy(350 * direction, 0);
  }

  getMenuItems(slides) {
    return slides.reduce((resultList, item) => {
      return resultList + `
        <a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>`;
      }, '');
  }

  setActiveMenu(menu, activeLink = null) {
    let menuItems = menu.querySelectorAll('.ribbon__item');
    [...menuItems].forEach((el) => {
      el.classList.remove('ribbon__item_active');
    });

    if (!activeLink) {
      activeLink = menu.querySelector('.ribbon__item');
    }

    activeLink.classList.add('ribbon__item_active');
  }

  setArrow(menu) {
    let ribbonInner = menu.querySelector('.ribbon__inner');
    let scrollLeft = ribbonInner.scrollLeft;
    let arrowLeft = menu.querySelector('.ribbon__arrow_left');
    let arrowRight = menu.querySelector('.ribbon__arrow_right');

    arrowRight.classList.add('ribbon__arrow_visible');
    arrowLeft.classList.add('ribbon__arrow_visible');

    if (scrollLeft > 0) {
      arrowRight.classList.add('ribbon__arrow_visible');
    } else {
      arrowLeft.classList.remove('ribbon__arrow_visible');
    }

    if (scrollLeft > 0 && (ribbonInner.scrollWidth - ribbonInner.clientWidth) <= scrollLeft) {
      arrowRight.classList.remove('ribbon__arrow_visible');
    }
  }
}
