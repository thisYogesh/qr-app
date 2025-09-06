import Handlebars from "./handlebars";
import { handleMultiAssignDatasetValue } from "../helpers";
import { randomId } from "../utils";

let counter = 0;
const getEval = path => {
  const paths = path
    .split(",")
    .map(path => path.trim())
    .map(path => `{_path: '${path}', ...obj.${path}}`);
  return new Function("obj", `return [${paths}]`);
};

const getFields = value =>
  [...Object.entries(value)]
    .filter(([_, value]) => typeof value.type === "string")
    .map(([title, value]) => ({ title, value }));

Handlebars.registerHelper({
  dynamic_field: function(fieldObj) {
    const { value } = fieldObj.field;
    const { type } = value;
    return type;
  },

  media_control: function(obj) {
    return Handlebars.compile(`
      <div class="media-control flex flex-col gap-1">
        <div class="media-control__preview bg-gray-100 border border-dashed border-gray-300 flex rounded justify-center">
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

        <div class="flex gap-1">
          <button class="flex items-center justify-between button basis-0 grow shrink-0">
            Upload Image
            <span class="sep w-[2px]"></span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
      d="M19 9L14 14.1599C13.7429 14.4323 13.4329 14.6493 13.089 14.7976C12.7451 14.9459 12.3745 15.0225 12 15.0225C11.6255 15.0225 11.2549 14.9459 10.9109 14.7976C10.567 14.6493 10.2571 14.4323 10 14.1599L5 9"
      stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="button basis-0 grow shrink-0">Paste SVG</button>
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
      <div data-field class="setting-block flex flex-col gap-2 border border-gray-300 p-2 rounded">
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
    this.$triggers = [];
    this.selectedCustomizeId = null;
    this.highlightedCustomizeId = null;
    this.settingsMap = {};
  }

  init({ storeConfig, eventMap }) {
    const $customisers = document.querySelectorAll("[data-customize]");
    const $app = (this.$app = document.querySelector("[data-app]"));
    this.$fieldViewer = document.querySelector("[data-config]");

    this.eventMap = eventMap;
    this.storeConfig = storeConfig;

    $app.addEventListener("click", () => {
      this.showConfigHandler();
    });

    $customisers.forEach($el => {
      const $trigger = document.createElement("span");

      $el.dataset.customize
        .split(",")
        .map(key => key.trim())
        .forEach(block => {
          const id = randomId();

          this.settingsMap[id] = block;

          $trigger.classList.add("hidden", "pointer-events-none");
          this.$triggers.push($trigger);

          $el.$trigger = $trigger;

          handleMultiAssignDatasetValue($trigger, "hcId", id);
          handleMultiAssignDatasetValue($el, "customizeId", id);
        });

      document.body.append($trigger);
      $el.addEventListener("mouseover", e => this.onSettingBlockHover(e));
    });

    // Prevent default behavior of all <a></a> elements
    const $anchors = $app.querySelectorAll("a");
    $anchors.forEach($anchor =>
      $anchor.addEventListener("click", e => e.preventDefault())
    );
  }

  onSettingBlockHover(e) {
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

    [...this.$triggers]
      .filter($el => $el !== $trigger)
      .filter($el => $el.dataset.hcId !== this.selectedCustomizeId)
      .forEach($el => $el.classList.add("hidden"));

    const { customizeId } = dataset;
    this.highlightedCustomizeId = customizeId;
  }

  getSettingKeys(customizeIds) {
    const { settingsMap } = this;
    const keys = customizeIds.split(",").map(id => settingsMap[id]?.trim());

    return keys.join(",");
  }

  showConfigHandler() {
    const { highlightedCustomizeId } = this;
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

    const settingKeys = this.getSettingKeys(selectedCustomizeId);
    this.showConfig(settingKeys);
  }

  showConfig(path) {
    const { storeConfig } = this;
    const settings = getEval(path)(storeConfig);
    const fields = [];

    settings.forEach(setting => {
      if (setting.type) {
        fields.push(this.makeField({ title: setting._path, value: setting }));
      } else
        fields.push(
          ...getFields(setting).map(({ title, value }) =>
            this.makeField({ title, value })
          )
        );
    });

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
    const template = Handlebars.compile(`
      <div class="root p-2">
        {{#if this.field}}
          {{> (dynamic_field this) }}
        {{/if}}

        <span class="svg flex w-4 h-4">
          <include-svg src="/svg/lightning.svg" />
        </span>
      </div>`);

    const fieldMap = this.extractFields({ title, value });

    return template(fieldMap);
  }
}

const Customizer = new AppCustomizer();
window.Customizer = Customizer;
window.addEventListener("@render-done", e => Customizer.init(e));
