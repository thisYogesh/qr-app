import Handlebars from "./handlebars";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import WranchTightningJson from "../lottie/wranch-tightning.json";

export const _if = (condition, content, _else = null) => {
  const exec = content => (typeof content == "function" ? content() : content);

  return condition ? exec(content) : exec(_else);
};

const MODE = {
  NORMAL: "1",
  CUSTOMIZER: "2"
};

Handlebars.registerHelper({
  anchor: function(ctx) {
    const { type, text, href } = ctx;
    if (type !== "anchor") return;

    return `<a href="${href}">${text}</a>`;
  },

  image: function(ctx) {
    const { type, src, svg_markup, size = {} } = ctx;
    if (type !== "image") return;

    const { height, width } = size;
    const template = Handlebars.compile(`
      {{#if src}}
        <img src="{{src}}" height="{{height}}" width="{{width}}"/>
      {{else}}
        <span>{{{svg_markup}}}</span>
      {{/if}}
    `);

    return template({ src, svg_markup, height, width });
  },
  app_bg: function(ctx) {
    const template = Handlebars.compile(
      `<div class="bg absolute inset-0" style="--bg-image: url({{image.src}}); --bg-opacity: {{opacity.value}}; --bg-size: {{bg_size.height}} {{bg_size.width}}"></div>`
    );

    return template(ctx);
  },
  app_button: function(ctx, index) {
    const { data, template } = ctx;
    const { background_color = {}, icon, label, href } = data.button;
    const { value: bg_color } = background_color;

    const temp = Handlebars.compile(`
    <a
      {{#if template}}
        data-trigger="#template-{{index}}"
      {{/if}}

      {{#if href}}
        href="{{href}}"
        target="_blank"
      {{else}}
        data-trigger="{{template}}"
      {{/if}}

      style="
        {{#if bg_color}}--bg-color: {{bg_color}};{{else}}--bg-color: #000080;{{/if}}
        {{#if text_color}}--text-color: {{text_color}};{{else}}--text-color: white;{{/if}}
      "

      class="app-button w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-105"
    >
      {{#if icon}}
        <span class="flex h-5 w-5">
          {{#image icon}}{{/image}}
        </span>
      {{/if}}
      {{ label }}
    </a>`);

    return temp({ template, icon, label, bg_color, href, index });
  },

  icon_with_content: function(ctx) {
    const { icon, content } = ctx;

    const template = Handlebars.compile(`
      <div class="flex text-sm items-start gap-1 text-blue-900 font-medium">
        <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full flex-shrink-0">
          {{#image icon}}{{/image}}
        </span>

        {{#if (_isEqualTo content.type 'anchor')}}
          <span class="underline">
            {{#anchor content}}{{/anchor}}
          </span>
        {{else}}
          <p>{{content}}</p>
        {{/if}}
      </div>`);

    return template({ icon, content });
  },

  dynamic_template: function(ctx) {
    const { index, root } = ctx.data;
    const { template } = root.actions[index];
    return template;
  }
});

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
              href="https://wa.me/{{this}}"
            >
              <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full">{{{../data.icon}}}</span>
              {{this}}
            </a>
          {{/each}}
        </div>`
    ),
    contact_us: Handlebars.registerPartial(
      "contact_us",
      `<div class="flex flex-col gap-2">
          {{#each data.items}}
            {{#icon_with_content this}}{{/icon_with_content}}
          {{/each}}
        </div>`
    ),
    simple_text: Handlebars.registerPartial("simple_text", `{{data.content}}`),

    render: Handlebars.compile(`
    <div data-app data-customize="default" class="flex flex-col w-full justify-between h-full gap-8 z-10">
      {{#app_bg backrgound}}{{/app_bg}}

      <header class="flex justify-center items-center pt-8">
        <div data-customize="logo">
          {{#image logo}}{{/image}}
        </div>
      </header>
      <main class="flex flex-col items-center justify-center px-4">
        {{#if status}}
          <div data-main class="flex w-full flex-col items-center justify-center">
            <div data-customize="action_background" class="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full">
              <div
                data-slide-container
                class="flex bg-white items-center duration-300 transform transition-all flex-grow max-w-full"
              >
                <ul data-trigger-container class="p-6 md:p-8 trigger flex flex-col w-full flex-shrink-0 gap-4">
                  {{#each actions}}
                    <li data-customize="actions[{{@index}}].data">
                      {{#app_button this @index}}{{/app_button}}
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

                          <span class="ml-2"> {{data.button.label}} </span>
                        </div>
                        {{> (dynamic_template)}}
                      </div>
                    {{/if}}
                  {{/each}}
                </div>
              </div>  
            </div>

            {{#if GST}}
              <div data-customize="GST" class="bg-white font-bold mt-8 px-2 py-1 rounded-md shadow text-blue-900 text-center text-sm">
                <a>GST – {{ GST.value }}</a>
              </div>
            {{/if}}
          </div>
        {{else}}
          <div>
            <div class="p-2">
              <canvas
                id="dotlottie-canvas"
                class="transform rotate-45 w-40 h-40"
              ></canvas>
            </div>  
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
          </div>
        {{/if}}
      </main>

      <footer class="pb-4">
        <p data-customize="Copywrite" class="text-center text-gray-600">
          {{Copywrite.value}}
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
    this.mode = $app.dataset.mode;

    const appContent = templates.render(storeConfig);

    fr.querySelector("div").innerHTML = appContent;

    // inject html into <render-app/>
    $app.replaceWith(fr.querySelector("[data-app]"));
    this.init();

    // emit event to know markup had injeected into html
    const buildEvent = new Event("@build");
    buildEvent.storeConfig = storeConfig;
    window.dispatchEvent(buildEvent);
  },

  init() {
    const { storeConfig } = this;
    if (storeConfig.status === 0) return this.enableWranchAnimation();

    const [$slideContainer, $containerEl] = document.querySelectorAll(
      "#content, [data-slide-container]"
    );
    this.$contentContainer = $containerEl;
    this.$slideContainer = $slideContainer;
    const $contentBlocks = (this.$contentBlocks = $slideContainer.querySelectorAll(
      "[data-trigger], [data-fn]"
    ));

    $contentBlocks.forEach($el =>
      $el.addEventListener("click", () =>
        this.eventListener(() => this.onContentBlockSelect($el))
      )
    );

    const { height } = $slideContainer.getBoundingClientRect();
    $slideContainer.style.setProperty("--root-height", `${height}px`);

    const $backButtons = (this.$backButtons = $slideContainer.querySelectorAll(
      "[data-back]"
    ));

    $backButtons.forEach($el =>
      $el.addEventListener("click", () =>
        this.eventListener(() => this.goBack())
      )
    );
  },

  eventListener(callback) {
    if (this.mode === MODE.CUSTOMIZER) return;
    callback();
  },

  enableWranchAnimation() {
    new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector("#dotlottie-canvas"),
      data: WranchTightningJson,
      speed: 0.8
    });
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
  }
};

window.addEventListener("DOMContentLoaded", () => app.install());
