import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.elem = this.render();
  }

  render() {
    const modal = createElement(`
      <div class="modal">
        <!--Прозрачная подложка перекрывающая интерфейс-->
        <div class="modal__overlay"></div>
          <div class="modal__inner">
            <div class="modal__header">
              <!--Кнопка закрытия модального окна-->
              <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
              </button>
              <h3 class="modal__title"></h3>
            </div>
            <div class="modal__body"></div>
          </div>
      </div>`);

    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        this.close();
      }
    });

    modal.addEventListener("click", (event) => {
      if (event.target.closest(".modal__close")) {
        event.preventDefault();
        this.close();
      }
    });

    return modal;
  }

  open() {
    document.body.append(this.elem);
    document.body.classList.add("is-modal-open");
  }

  close() {
    this.elem.remove();
    document.body.classList.remove("is-modal-open");
  }

  setBody(body) {
    this.elem.querySelector(".modal__body").append(body);
  }

  setTitle(title) {
    this.elem.querySelector(".modal__title").append(title);
  }
}
