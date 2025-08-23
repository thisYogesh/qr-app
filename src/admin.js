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
  }
});

Handlebars.registerPartial({
  image: ``,
  button: `
  <div class="main border p-2">
    <label>{{title}}</label>
    <input type="text" value="{{value.label}}"/>
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
    const { title, value } = field;
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

    console.log(this.extractFields(field));

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

    return template({ field, fields: getFields(value) });
  }
};

window.addEventListener("@build", e => Customiser.init(e));
