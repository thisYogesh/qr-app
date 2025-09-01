import Handlebars from "./handlebars";
import { randomId } from "./utils";

let counter = 0;
const getEval = path => {
  const paths = path.split(",").map(path => `obj.${path}`);
  return new Function("obj", `return [${paths}]`);
};

const getFields = value =>
  [...Object.entries(value)]
    .filter(([_, value]) => value.type)
    .map(([title, value]) => ({ title, value }));

Handlebars.registerHelper({
  dynamic_field: function(fieldObj) {
    const { value } = fieldObj.field;
    const { type } = value;
    return type;
  },

  media_control: function(obj) {
    return Handlebars.compile(`
      <div class="media-control">
        <div class="media-control__preview bg-gray-100 border border-dashed border-gray-200 flex rounded justify-center">
          {{#if this.src}}
            <img src="{{this.src}}" class="w-32 h-32 object-contain image-bg"/>
          {{else if this.svg_markup}}
            <div class="media-control__svg w-32 h-32 image-bg">
              {{{this.svg_markup}}}
            </div>
          {{else}}
            No Image Provided
          {{/if}}
        </div>
      </div>
    `)(obj);
  },

  input_control: function(label, type, value) {
    const id = `input-${counter++}`;
    return Handlebars.compile(`
      <div class="input flex flex-col gap-0.5">
        {{#if label}}
          <label for="${id}" class="input__label capitalize text-gray-700 font-semibold text-xs">{{ label }}</label>
        {{/if}}
        <input id="${id}" class="text-sm h-8" type="{{this.type}}" value="{{this.value}}"/>
      </div>
    `)({ label, type, value });
  },

  setting_block: function(title, util) {
    const innerContent = util.fn(this);

    return Handlebars.compile(`
      <div data-field class="setting-block flex flex-col gap-2 border p-2 rounded">
        <div class="main-settings">
          <span class="capitalize text-sm">${title}</span>
          ${innerContent}
        </div>

        {{#if this.fields.length}}
          <div class="sub-settings flex flex-col gap-2">
            {{#each this.fields}}
              {{> (dynamic_field this) }}
            {{/each}}
          </div>
        </div>
        {{/if}}
      </div>
    `)(this);
  }
});

Handlebars.registerPartial({
  size: `
  {{#setting_block this.field.title}}
    <div class="flex gap-2">
      {{#input_control 'width' 'text' this.field.value.width}}{{/input_control}}
      {{#input_control 'height' 'text' this.field.value.height}}{{/input_control}}
    </div>
  {{/setting_block}}
  `,

  "link-button": `
  {{#setting_block this.field.title}}
    <div class="flex flex-col gap-2">
      {{#input_control 'Title' 'text' this.field.value.label}}{{/input_control}}
      {{#input_control 'Hyperlink' 'text' this.field.value.href}}{{/input_control}}
    </div>
  {{/setting_block}}
  `,

  image: `
  {{#setting_block this.field.title}}
    {{#media_control this.field.value}}{{/media_control}}
  {{/setting_block}}
  `,

  color: `
  {{#setting_block this.field.title}}
    {{#input_control '' 'color' this.field.value.value}}{{/input_control}}
  {{/setting_block}}
  `,
  button: `
  {{#setting_block this.field.title}}
    {{#input_control 'Title' 'text' this.field.value.label}}{{/input_control}}
  {{/setting_block}}
  `,
  value: `
  {{#setting_block this.field.title}}
    {{#input_control '' 'text' this.field.value.value}}{{/input_control}}
  {{/setting_block}}
  `,
  opacity: `
  {{#setting_block this.field.title}}
    <input type="range" min="0" max="1" step="0.01" value="{{this.field.value.value}}"/>
  {{/setting_block}}
  `
});

class AppCustomizer {
  constructor() {
    this.selectedCustomizeId = null;
    this.highlightedCustomizeId = null;
    this.settingsMap = {};
  }

  init({ storeConfig, eventMap }) {
    const $customisers = document.querySelectorAll("[data-customize]");
    this.$app = document.querySelector("[data-app]");
    this.$fieldViewer = document.querySelector("[data-config]");

    this.storeConfig = storeConfig;
    const $triggers = [];

    this.$app.addEventListener("click", () => {
      this.showConfigHandler();
    });

    $customisers.forEach($el => {
      const id = randomId();
      const $trigger = document.createElement("span");

      this.settingsMap[id] = $el.dataset.customize;

      $trigger.dataset.hcId = id;
      $trigger.classList.add("hidden", "pointer-events-none");

      $el.$trigger = $trigger;
      $el.dataset.customizeId = id;

      document.body.append($trigger);

      $triggers.push($trigger);

      $el.addEventListener("mouseover", e => {
        e.stopPropagation();

        const { $trigger, dataset } = e.currentTarget;
        const {
          height,
          width,
          left,
          top
        } = e.currentTarget.getBoundingClientRect();

        $trigger.style.setProperty("height", height + "px");
        $trigger.style.setProperty("width", width + "px");

        $trigger.style.setProperty("left", left + "px");
        $trigger.style.setProperty("top", top + "px");

        $trigger.classList.remove("hidden");

        [...$triggers]
          .filter($el => $el !== $trigger)
          .filter($el => $el.dataset.hcId !== this.selectedCustomizeId)
          .forEach($el => $el.classList.add("hidden"));

        const { customizeId } = dataset;
        this.highlightedCustomizeId = customizeId;
      });
    });
  }

  showConfigHandler() {
    const { highlightedCustomizeId, settingsMap } = this;
    const selectedCustomizeId = (this.selectedCustomizeId = highlightedCustomizeId);

    const $prevSelectedHighlighter = document.querySelector(
      "[data-hc-id].--selected"
    );
    if ($prevSelectedHighlighter) {
      $prevSelectedHighlighter.classList.remove("--selected");
      $prevSelectedHighlighter.classList.add("hidden");
    }

    const $selectedHighlighter = document.querySelector(
      `[data-hc-id="${selectedCustomizeId}"]`
    );
    $selectedHighlighter.classList.add("--selected");

    this.showConfig(settingsMap[selectedCustomizeId]);
  }

  showConfig(path) {
    const { storeConfig } = this;
    const [data] = getEval(path)(storeConfig);
    const fields = [];

    if (data.type) {
      fields.push(this.makeField({ title: path, value: data }));
    } else {
      fields.push(
        ...getFields(data).map(({ title, value }) =>
          this.makeField({ title, value })
        )
      );
    }

    this.$fieldViewer.innerHTML = fields.join("");
  }

  extractFields(field) {
    const { value } = field;
    const fields = {
      field,
      fields: getFields(value).map(field => this.extractFields(field))
    };
    return fields;
  }

  makeField(field) {
    const { title, value } = field;
    const isString = typeof value === "string";

    const template = Handlebars.compile(`
      <div class="root p-2">
        {{#if this.field}}
          {{> (dynamic_field this) }}
        {{/if}}
      </div>`);

    const fieldMap = this.extractFields(field);

    return template(fieldMap);
  }
}

const Customizer = new AppCustomizer();
window.Customizer = Customizer;
window.addEventListener("@render-done", e => Customizer.init(e));
