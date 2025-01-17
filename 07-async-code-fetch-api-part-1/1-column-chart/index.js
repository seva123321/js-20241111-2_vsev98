import fetchJson from "./utils/fetch-json.js";
import { default as ColumnChartStatic } from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";
const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart extends ColumnChartStatic {
  subElements = {};

  constructor({
    url = "api/dashboard/sales",
    range = {
      from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      to: new Date(),
    },
    ...args
  } = {}) {
    super(args);

    this.url = url;
    this.range = range;
    this.from = range.from;
    this.to = range.to;

    this.label ??= args.label;
    this.link ??= args.link;
    this.formatHeading ??= args.formatHeading;

    this.element = this.createElement(this.createElementTemplate());
    this.selectSubElements();

    this.fetchData();
  }

  async fetchData() {
    try {
      const data = await fetchJson(this.createUrl());
      this.data = Object.values(data);

      this.updateChart();
      return data; 
    } catch (error) {
      console.error('Error fetching data:', error);
      return []; 
    }
  }

  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createUrl() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append("from", this.from.toISOString());
    url.searchParams.append("to", this.to.toISOString());
    return url.toString();
  }

  calculateAllValues() {
    this.value = this.data.reduce((acc, value) => acc + value, 0); 
  }

  updateChart() {
    if (this.data.length) {
      this.calculateAllValues();
      this.subElements.header.innerHTML = `${this.formatHeading(this.value)} ${this.createLinkTemplate()}`;
      this.subElements.body.closest(`[style^="--chart-height"]`).className = this.createChartClasses();
      this.subElements.body.innerHTML = this.createChatBodyTemplate();
    } else {

      this.subElements.body.closest(`[style^="--chart-height"]`).className = 'column-chart column-chart_loading';
    }
  }

  async update(from, to) {
    this.from = from;
    this.to = to;
    return await this.fetchData(); 
  }
}