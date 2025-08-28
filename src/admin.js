import Handlebars from "handlebars";
const getEval = path => new Function("obj", `return obj.${path}`);

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
        <div class="media-control__preview bg-gray-100 border border-gray-200 flex rounded justify-center">
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
  }
});

Handlebars.registerPartial({
  size: `
  <div data-field="size" class="field size border p-2">
    <label>{{this.field.title}}</label>
    <input type="text" value="{{this.field.value.width}}"/>
    <input type="text" value="{{this.field.value.height}}"/>

    <div class="sub-field">
      {{#each this.fields}}
        {{> (dynamic_field this) }}
      {{/each}}
    </div>
  </div>`,
  "link-button": `
  <div data-field="link-button" class="field link-button border p-2">
    <label>{{this.field.title}}</label>

    <input type="text" value="{{this.field.value.label}}"/>
    <input type="text" value="{{this.field.value.href}}"/>

    <div class="sub-field">
      {{#each this.fields}}
        {{> (dynamic_field this) }}
      {{/each}}
    </div>
  </div>
  `,
  image: `
  <div data-field="image" class="field image border p-2">
    <label>{{this.field.title}}</label>
    {{#media_control this.field.value}}{{/media_control}}

    <div class="sub-field">
      {{#each this.fields}}
        {{> (dynamic_field this) }}
      {{/each}}
    </div>
  </div>
  `,

  color: `
  <div data-field="color" class="field color border p-2">
    <label>{{this.field.title}}</label>
    <input type="color" value="{{this.field.value.value}}"/>

    <div class="sub-field">
      {{#each this.fields}}
        {{> (dynamic_field this) }}
      {{/each}}
    </div>
  </div>
  `,
  button: `
  <div data-field="button" class="field button border p-2">
    <label>{{this.field.title}}</label>
    <input type="text" value="{{this.field.value.label}}"/>

    <div class="sub-field">
      {{#each this.fields}}
        {{> (dynamic_field this) }}
      {{/each}}
    </div>
  </div>`
});

const Customiser = {
  init(e) {
    const $customisers = document.querySelectorAll("[data-customize]");
    const $triggers = [];

    $customisers.forEach($el => {
      const $trigger = document.createElement("span");

      $trigger.dataset.customizeTrigger = true;
      $trigger.classList.add("hidden");

      $el.$trigger = $trigger;
      document.body.append($trigger);

      $triggers.push($trigger);

      $el.addEventListener("mouseenter", e => {
        const { $trigger } = e.target;
        const { height, width, left, top } = e.target.getBoundingClientRect();

        $trigger.style.setProperty("height", height + "px");
        $trigger.style.setProperty("width", width + "px");

        $trigger.style.setProperty("left", left + "px");
        $trigger.style.setProperty("top", top + "px");

        $trigger.classList.remove("hidden");

        [...$triggers]
          .filter($el => $el !== $trigger)
          .forEach($el => $el.classList.add("hidden"));
      });

      $trigger.addEventListener("click", () => {
        const { customize } = $el.dataset;
        this.showConfig(customize);
      });
    });

    this.storeConfig = e.storeConfig;
    this.$fieldViewer = document.querySelector("[data-config]");
  },

  showConfig(path) {
    const { storeConfig } = this;
    const data = getEval(path)(storeConfig);
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
  },

  extractFields(field) {
    const { value } = field;
    const fields = {
      field,
      fields: getFields(value).map(field => this.extractFields(field))
    };
    return fields;
  },

  makeField(field) {
    const { title, value } = field;
    const isString = typeof value === "string";

    const template = Handlebars.compile(`
      <div class="root border p-2">
        {{#if this.field}}
          {{> (dynamic_field this) }}
        {{/if}}
      </div>`);

    const fieldMap = this.extractFields(field);

    // if (value.type === "button") {
    //   return `<div class="border p-2">
    //     <label>${title}</label>
    //     <input type="text" value="${value.label}"/>

    //     <div>
    //       ${getFields(value)
    //         .map(field => this.makeField(field))
    //         .join("")}
    //     </div>
    //   </div>`;
    // } else if (value.type === "link-button") {
    //   return `<div class="border p-2">
    //     <label>${title}</label>
    //     <input type="text" value="${value.label}"/>

    //     <div>
    //       ${getFields(value)
    //         .map(field => this.makeField(field))
    //         .join("")}
    //     </div>
    //   </div>`;
    // } else if (value.type === "color") {
    //   return `<div class="border p-2">
    //     <label>${title}</label>
    //     <input type="color" value="${value.value}"/>

    //     <div>
    //       ${getFields(value)
    //         .map(field => this.makeField(field))
    //         .join("")}
    //     </div>
    //   </div>`;
    // } else if (value.type === "size") {
    //   return `<div class="border p-2">
    //     <label>${title}</label>
    //     <div class="flex gap-1">
    //       <input type="text" value="${value.height}"/>
    //       <input type="text" value="${value.width}"/>
    //     </div>

    //     <div>
    //       ${getFields(value)
    //         .map(field => this.makeField(field))
    //         .join("")}
    //     </div>
    //   </div>`;
    // } else if (isString)
    //   return `<div class="border p-2"><label>${title}</label> <input type="text" value="${value}"/></div>`;

    return template(fieldMap);
  }
};

window.addEventListener("@build", e => Customiser.init(e));
