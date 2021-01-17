import createElement from '../../assets/lib/create-element.js';

// export default class StepSlider {
//   constructor({ steps, value = 0 }) {
//   }
// }

export default class StepSlider {
  constructor(config) {
    this.elem = this.render(config);

    // this.elem = document.createElement('div');
    // this.elem.classList.add("slider");
    // this.render({ steps, value });
    // let thumb = this.elem.querySelector('.slider__thumb');
    // let progress = this.elem.querySelector('.slider__progress');
    // let sliderValue = this.elem.querySelector('.slider__value');
    // let sliderSteps = this.elem.querySelectorAll('.slider__steps > span');
    // this.elem.addEventListener('click', (event) => {
    //   let left = event.clientX - this.elem.getBoundingClientRect().left;
    //   let leftRelative = left / this.elem.offsetWidth;
    //   let segments = steps - 1;
    //   let approximateValue = leftRelative * segments;
    //   let value = Math.round(approximateValue);
    //   let valuePercents = value / segments * 100;
    //   sliderValue.innerHTML = `${value}`;
    //   [...sliderSteps].forEach((el) => {
    //     el.classList.remove('slider__step-active');
    //   });
    //   sliderSteps[value].classList.add('slider__step-active');
    //   thumb.style.left = `${valuePercents}%`;
    //   progress.style.width = `${valuePercents}%`;

    //   event.target.closest(".slider").dispatchEvent(new CustomEvent('slider-change', {
    //     detail: value,
    //     bubbles: true
    //   }))
    // })
  }

  render(config) {
    const slider = createElement(`
      <!--Корневой элемент слайдера-->
      <div class="slider">

        <!--Ползунок слайдера с активным значением-->
        <div class="slider__thumb">
          <span class="slider__value">0</span>
        </div>

        <!--Полоска слайдера-->
        <div class="slider__progress"></div>

        <!-- Шаги слайдера (вертикальные чёрточки) -->
        <div class="slider__steps">
          ${this.getSliderSteps(config.steps, config.value)}
        </div>
      </div>
    `);


    let thumb = slider.querySelector('.slider__thumb');
    let progress = slider.querySelector('.slider__progress');
    let sliderValue = slider.querySelector('.slider__value');
    let sliderSteps = slider.querySelectorAll('.slider__steps > span');

    slider.addEventListener('click', (event) => {
      let left = event.clientX - this.elem.getBoundingClientRect().left;
      let leftRelative = left / this.elem.offsetWidth;
      let segments = config.steps - 1;
      let approximateValue = leftRelative * segments;
      let value = Math.round(approximateValue);
      let valuePercents = value / segments * 100;
      sliderValue.innerHTML = `${value}`;
      [...sliderSteps].forEach((el) => {
        el.classList.remove('slider__step-active');
      });
      sliderSteps[value].classList.add('slider__step-active');
      thumb.style.left = `${valuePercents}%`;
      progress.style.width = `${valuePercents}%`;

      event.target.closest(".slider").dispatchEvent(new CustomEvent('slider-change', {
        detail: value,
        bubbles: true
      }))
    })

    return slider;
  }

  getSliderSteps(steps, value = 0) {
    let stepsArr = [];
    for (let i=0; i < steps; i++) {
      stepsArr.push(`<span ${i === value ? `class="slider__step-active"` : ``}></span>`);
    }

    return stepsArr.join("");
  }

//   render({ steps, value }){
//     let sliderSteps = [];
//     for (let i = 0; i < steps; i++) {
//       if (i === value) {
//         sliderSteps.push(`
//         <span class="slider__step-active"></span>
//         `);
//       } else {
//         sliderSteps.push(`
//         <span></span>
//         `);
//       }
//     }

//     this.elem.innerHTML = `
//     <div class="slider__thumb">
//       <span class="slider__value">0</span>
//     </div>
//     <div class="slider__progress"></div>
//     <div class="slider__steps">
//       ${sliderSteps.join("")}
//     </div>
//     `
//   }


}
