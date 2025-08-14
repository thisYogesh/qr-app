import Handlebars from "handlebars";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import WranchTightningJson from "../lottie/wranch-tightning.json";

const app = {
  URL: new URL(location.href),
  storeConfig: null,

  $contentContainer: null,
  $slideContainer: null,
  $contentBlocks: [],
  $backButtons: [],

  helpers: {
    asset: Handlebars.registerHelper("asset", function(ctx) {
      const { type, url, height, width } = ctx;
      if (type !== "asset") return;

      return new Handlebars.SafeString(
        `<img src="${url}" height="${height}" width="${width}"/>`
      );
    }),
    app_bg: Handlebars.registerHelper("app_bg", function(ctx) {
      const { url, opacity } = ctx;
      return `<div class="bg absolute inset-0" style="--bg-image: url(${url}); --bg-opacity: ${opacity}"></div>`;
    }),
    dynamic_template: Handlebars.registerHelper("dynamic_template", function(
      context
    ) {
      const { index, root } = context.data;
      const { template } = root.actions[index];
      return template;
    })
  },

  templates: {
    list_phone_numbers: Handlebars.registerPartial(
      "list_phone_numbers",
      `<div class="flex flex-col gap-2">
          {{#each data.contact_numbers}}
            <a
              class="flex items-center gap-1 text-blue-900 font-bold"
              href="https://wa.me/{{this}}"
            >
              <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full">{{{../data.icon}}}</span>
              {{this}}
            </a>
          {{/each}}
        </div>`
    ),
    address_with_phone_numbers: Handlebars.registerPartial(
      "address_with_phone_numbers",
      `<div>
        <div class="flex flex-col gap-2">
          {{#each data.contact_numbers}}
            <a
              class="flex text-sm items-center gap-1 text-blue-900 font-medium"
              href="https://wa.me/{{this}}"
            >
              <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full">{{{../data.icon}}}</span>
              <span class="underline">{{this}}</span>
            </a>
          {{/each}}
            <a
              class="flex text-sm items-center gap-1 text-blue-900 font-medium"
              href="mailto:{{data.email}}"
            >
              <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full">{{{data.email_icon}}}</span>
              <span class="underline">{{data.email}}</span>
            </a>
          <div class="flex text-sm items-start gap-1 text-blue-900 font-medium">
            <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full flex-shrink-0">{{{data.store_icon}}}</span>
            <p>
              {{data.address}}
            </p>
          </div>
        </div>
      </div>`
    ),
    simple_text: Handlebars.registerPartial("simple_text", `{{data.content}}`),

    render: Handlebars.compile(`
    <div data-app class="flex flex-col justify-between h-full gap-8 z-10">
      {{#app_bg backrgound}}{{/app_bg}}

      <header class="flex justify-center items-center pt-8">
        {{#asset logo}}{{/asset}}
      </header>
      <main class="flex flex-col items-center justify-center px-4">
        {{#if status}}
          <div data-main class="flex w-full md:w-96 flex-col items-center justify-center">
            <div class="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full">
              <div
                data-slide-container
                class="flex bg-white items-center duration-300 transform transition-all flex-grow max-w-full"
              >
                <ul data-trigger-container class="p-6 md:p-8 trigger flex flex-col w-full flex-shrink-0 gap-4">
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

                        class="w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-105
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
                        class="flex flex-col gap-4 p-6 md:p-8 hidden w-full content-block bg-white"
                      >
                        <div class="flex items-center">
                          <button
                            data-back
                            class="flex justify-center items-center w-8 h-8 rounded-full bg-blue-900 text-white"
                          >
                            <svg viewBox="0 0 20 20" class="h-5 w-5" aria-hidden="true">
                              <use href="./svg-sprites.svg#back-arrow" />
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
            </div>

            {{#if GST}}
              <div class="bg-white font-bold mt-8 px-2 py-1 rounded-md shadow text-blue-900 text-center text-sm">
                <a>GST – {{ GST }}</a>
              </div>
            {{/if}}
          </div>
        {{else}}
          <p
            data-status="0"
            class="flex items-center justify-center gap-1 mt-2"
          >
            <svg
              class="w-6 h-6 text-yellow-500"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.995 1.827a1.745 1.745 0 0 0-2.969 0l-9.8 17.742a1.603 1.603 0 0 0 0 1.656 1.678 1.678 0 0 0 1.48.775H22.28a1.68 1.68 0 0 0 1.484-.775 1.608 1.608 0 0 0 .003-1.656zM12 8h1v7h-1zm.5 10.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1z"
                fill="currentColor"
              />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
            <span class="text-blue-900"> We are opening soon!! </span>
          </p>
        {{/if}}
      </main>

      <footer>
        <p class="text-center text-gray-600 pb-4">
          &copy; 2025 Manyog. All rights reserved.
        </p>
      </footer>
    </div>
    `)
  },

  async install() {
    const buildHash = "<build-hash>".replace("<build-hash>", "") || Date.now();
    const { items } = await fetch(`/manifest.json?hash=${buildHash}`)
      .then(resp => resp.json())
      .then(data => data);

    const storeId = this.URL.searchParams.get("store_id");
    const storeConfig = storeId?.trim()
      ? items.find(config => config.store_id === storeId)
      : items[0];

    this.storeConfig = storeConfig;
    this.build();
  },

  build() {
    const { templates, storeConfig } = this;

    const fr = document.createDocumentFragment();
    fr.append(document.createElement("div"));

    const $app = document.querySelector("render-app");
    const appContent = templates.render(storeConfig);

    fr.querySelector("div").innerHTML = appContent;

    // inject html into <render-app/>
    $app.replaceWith(fr.querySelector("[data-app]"));
    this.init();
  },

  init() {
    const [$slideContainer, $containerEl] = document.querySelectorAll(
      "#content, [data-slide-container]"
    );
    this.$contentContainer = $containerEl;
    this.$slideContainer = $slideContainer;
    const $contentBlocks = (this.$contentBlocks = $slideContainer.querySelectorAll(
      "[data-trigger], [data-fn]"
    ));

    $contentBlocks.forEach($el =>
      $el.addEventListener("click", () => this.onContentBlockSelect($el))
    );

    const { height } = $slideContainer.getBoundingClientRect();
    $slideContainer.style.setProperty("--root-height", `${height}px`);

    const $backButtons = (this.$backButtons = $slideContainer.querySelectorAll(
      "[data-back]"
    ));

    $backButtons.forEach($el =>
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
      .forEach($el => $el.classList.add("hidden"));

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
  }
};

new DotLottie({
  autoplay: true,
  loop: true,
  canvas: document.querySelector("#dotlottie-canvas"),
  data: WranchTightningJson,
  speed: 0.8
});

window.addEventListener("DOMContentLoaded", () => app.install());
