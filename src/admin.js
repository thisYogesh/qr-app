const getEval = path => new Function("obj", `return obj.${path}`);

const getFields = value =>
  [...Object.entries(value)]
    .filter(([_, value]) => value.type)
    .map(([title, value]) => ({ title, value }));

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

    const fields = [...Object.entries(data)].map(([title, value]) =>
      this.makeField({ title, value })
    );

    console.log(fields);

    this.$fieldViewer.innerHTML = fields.join("");
  },

  makeField({ title, value }) {
    const isString = typeof value === "string";

    if (value.type === "button") {
      return `<div class="border p-2">
        <label>${title}</label>
        <input type="text" value="${value.label}"/>

        <div>
          ${getFields(value)
            .map(field => this.makeField(field))
            .join("")}
        </div>
      </div>`;
    } else if (value.type === "color") {
      return `<div class="border p-2">
        <label>${title}</label>
        <input type="color" value="${value.value}"/>

        <div>
          ${getFields(value)
            .map(field => this.makeField(field))
            .join("")}
        </div>
      </div>`;
    } else if (isString)
      return `<div class="border p-2"><label>${title}</label> <input type="text"/></div>`;

    return "";
  }
};

window.addEventListener("@build", e => Customiser.init(e));
