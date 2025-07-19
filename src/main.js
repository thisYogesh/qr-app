import Handlebars from "handlebars";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import lt from "../lottie/wranch-tightning.lottie";

const app = {
  URL: new URL(location.href),
  storeConfig: null,

  $contentContainer: null,
  $slideContainer: null,
  $contentBlocks: [],
  $backButtons: [],

  templates: {
    list_phone_numbers: Handlebars.registerPartial(
      "list_phone_numbers",
      `<div class="flex flex-col gap-2">
          {{#each data.contact_numbers}}
            <a
              class="flex items-center gap-1 text-blue-900 font-bold"
              href="tel:{{this}}"
            >
              <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full">{{{../data.icon}}}</span>
              {{this}}
            </a>
          {{/each}}
        </div>`
    ),
    simple_text: Handlebars.registerPartial("simple_text", `{{data.content}}`),
    dynamic_template: Handlebars.registerHelper(
      "dynamic_template",
      function (context) {
        const { index, root } = context.data;
        const { template } = root.actions[index];
        return template;
      }
    ),
    render: Handlebars.compile(`
      <div
        data-slide-container
        class="flex bg-white items-center w-96 w-max-[90%] duration-300 transform transition-all"
      >
        <ul data-trigger-container class="p-8 trigger flex flex-col w-full flex-shrink-0 gap-4">
          {{#each actions}}
            <li>
              <a
                {{#if template}}
                  data-trigger="#template-{{@index}}"
                {{/if}}

                {{#if data.href}}
                  href="{{data.href}}"
                  target="_blank"
                {{else}}
                  data-trigger="{{template}}"
                {{/if}}

                class="w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer
                {{#if data.yellow_button}}
                  text-blue-900 bg-yellow-400
                {{else}}
                  text-white bg-blue-900
                {{/if}}
                "
              >
                {{#if data.icon}}
                  <span class="flex h-5 w-5">
                  {{{ data.icon }}}
                  </span>
                {{/if}}
                {{ data.title }}
              </a>
            </li>
          {{/each}}
        </ul>

        <div
          data-content-container
          id="content"
          class="relative w-full flex-shrink-0"
        >
          {{#each actions}}
            {{#if template}}
              <div
                id="template-{{@index}}"
                class="flex flex-col gap-4 p-8 hidden w-full content-block bg-white"
              >
                <div class="flex items-center">
                  <button
                    data-back
                    class="flex justify-center items-center w-8 h-8 rounded-full bg-blue-900 text-white"
                  >
                    <svg viewBox="0 0 20 20" class="h-5 w-5" aria-hidden="true">
                      <use href="#back-arrow" />
                    </svg>
                  </button>

                  <span class="ml-2"> {{data.title}} </span>
                </div>
                {{> (dynamic_template)}}
              </div>
            {{/if}}
          {{/each}}
        </div>
      </div>  
    `),
  },

  async install() {
    const { items } = await fetch(
      "https://manyog.s3.ap-south-1.amazonaws.com/qr-app-data.json"
    )
      .then((resp) => resp.json())
      .then((data) => data);

    const storeId = this.URL.searchParams.get("store_id");
    const storeConfig = storeId?.trim()
      ? items.find((config) => config.store_id === storeId)
      : items[0];

    this.storeConfig = storeConfig;

    const fr = document.createDocumentFragment();
    fr.append(document.createElement("div"));

    const $app = document.querySelector("[data-app]");
    const appContent = this.templates.render(storeConfig);

    fr.querySelector("div").innerHTML = appContent;

    // inject html into [data-app]
    setTimeout(() => {
      const $main = document.querySelector("#main");
      $main.classList.add("rounded-lg");
      $main.classList.remove("rounded-full");

      $app.replaceWith(fr.querySelector("[data-slide-container]"));
      this.init();
    }, 1000);
  },

  init() {
    const [$slideContainer, $containerEl] = document.querySelectorAll(
      "#content, [data-slide-container]"
    );
    this.$contentContainer = $containerEl;
    this.$slideContainer = $slideContainer;
    const $contentBlocks = (this.$contentBlocks =
      $slideContainer.querySelectorAll("[data-trigger], [data-fn]"));

    $contentBlocks.forEach(($el) =>
      $el.addEventListener("click", () => this.onContentBlockSelect($el))
    );

    const { height } = $slideContainer.getBoundingClientRect();
    $slideContainer.style.setProperty("--root-height", `${height}px`);

    const $backButtons = (this.$backButtons =
      $slideContainer.querySelectorAll("[data-back]"));

    $backButtons.forEach(($el) =>
      $el.addEventListener("click", () => this.goBack())
    );
  },

  onContentBlockSelect($blockButton) {
    const { fn, trigger } = $blockButton.dataset;

    if (fn) {
      this.methods?.[fn]?.call(this);
      return;
    }

    if (trigger) this.slideTo(trigger);
  },

  slideTo(contentId) {
    const { $contentContainer, $slideContainer } = this;

    // hide all content
    $contentContainer
      .querySelectorAll(".content-block")
      .forEach(($el) => $el.classList.add("hidden"));

    // show relevent content
    const $content = $contentContainer.querySelector(contentId);
    $content.classList.remove("hidden");
    const { height: contentHeight } = $content.getBoundingClientRect();

    // start transition
    $slideContainer.classList.add("-translate-x-full");
    $slideContainer.style.setProperty("--dynamic-height", `${contentHeight}px`);
  },

  goBack() {
    const { $slideContainer } = this;
    $slideContainer.style.removeProperty("--dynamic-height");
    $slideContainer.classList.remove("-translate-x-full");
  },

  methods: {
    // async shareLocation() {
    //   const { canShare } = this;
    //   if (canShare) {
    //     return await navigator
    //       .share({
    //         title: "Manyog",
    //         text: "Manyog — Hardware & Sanitaryware",
    //         url: "https://g.co/kgs/yc2gBs5",
    //       })
    //       .catch((err) => console.log(err));
    //   }
    //   // copy to clipboard
    //   navigator.clipboard.writeText("https://g.co/kgs/yc2gBs5");
    // },
  },
};

new DotLottie({
  autoplay: true,
  loop: true,
  canvas: document.querySelector("#dotlottie-canvas"),
  src: lt, // or .json file
  speed: 0.8,
});

window.addEventListener("DOMContentLoaded", () => app.install());
