export default class NotificationMessage {
  element;
  isAdded = false;

  constructor(
    message = "",
    { duration = 2000, type = "success" } = { duration: 2000, type: "success" }
  ) {
    this.duration = duration;
    this.message = message;
    this.type = type;
    this.element = this.createElement(this.createElementTemplate());
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createElementTemplate() {
    return `<div class="notification ${this.type}" style="--value:${
      (this.duration + 100) / 1000
    }s">
              <div class="timer"></div>
              <div class="inner-wrapper">
                  <div class="notification-header">${this.type}</div>
                  <div class="notification-body">
                    ${this.message}
                  </div>
              </div>
            </div>`;
  }

  show(parentElement = document.body) {
    if (NotificationMessage.isAdded) return;
    parentElement.append(this.element);

    NotificationMessage.isAdded = true;

    this.timerId = setTimeout(() => {
      NotificationMessage.isAdded = false;

      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
    clearTimeout(this.timerId);
  }

  destroy() {
    this.remove();
    clearTimeout(this.timerId);
  }
}
