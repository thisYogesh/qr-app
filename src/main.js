import Handlebars from "./handlebars";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import WranchTightningJson from "../lottie/wranch-tightning.json";
import { randomId } from "./utils";
import { handleMultiAssignDatasetValue } from "../helpers";

// common component shared accross main app and customizer
import "../components/placeholder";

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
    if (!["image", "image-only"].includes(type)) return;

    const { height = "auto", width = "auto" } = size;
    const template = Handlebars.compile(`
      {{#if src}}
        <img src="{{src}}" height="{{height}}" width="{{width}}"/>
      {{else if svg_markup}}
        <span class="flex svg">{{{svg_markup}}}</span>
      {{else}}
        <div class="flex min-w-40 min-h-16">
          <place-holder>
            <span data-info class="z-10 py-1.5">
              Add Image
            </span>
          </place-holder>
        </div>
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
    const { button, template } = ctx;
    const { background_color = {}, icon, label, href } = button;
    const { value: bg_color } = background_color;

    const temp = Handlebars.compile(`
    <a
      data-customize-trigger="actions[{{index}}].button"
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

  icon_with_content: function(ctx, options) {
    const { icon, content } = ctx;
    const [index, parentIndex] = [
      options.data.index,
      options.data._parent.index
    ];

    const template = Handlebars.compile(`
      <div data-customize-trigger="actions[{{parentIndex}}].items[{{index}}]" class="flex text-sm items-start gap-1 text-blue-900 font-medium">
        <span class="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full flex-shrink-0">
          {{#image icon}}{{/image}}
        </span>

        {{#if (_isEqualTo content.type 'anchor')}}
          <span class="underline">
            {{#anchor content}}{{/anchor}}
          </span>
        {{else}}
          <p>{{content.value}}</p>
        {{/if}}
      </div>`);

    return template({ icon, content, index, parentIndex });
  },

  dynamic_template: function(ctx) {
    const { index, root } = ctx.data;
    const { template } = root.actions[index];
    return template;
  }
});

Handlebars.registerPartial({
  contact_us: `
  <div class="flex flex-col gap-2">
    {{#each items}}
      {{#icon_with_content this}}{{/icon_with_content}}
    {{/each}}

    <div data-customize-trigger="actions.items.new">
      <place-holder class="py-1 rounded-sm">
        <span data-info class="z-10 px-1">
          + Add Row
        </span>
      </place-holder>
    </div>
  </div>`,

  simple_text: `
  <div data-customize-trigger="actions[{{@index}}].content">
    {{content.value}}
  </div>
  `
});

const app = {
  URL: new URL(location.href),
  storeConfig: null,

  $contentContainer: null,
  $slideContainer: null,
  $contentBlocks: [],
  $backButtons: [],

  eventMap: {},

  templates: {
    render: Handlebars.compile(`
    <div data-customizer class="flex flex-col gap-0.5 w-full h-full">
      <div class="flex items-center gap-1 p-1" data-customize-trigger="metadata">
        <div class="w-5">
          {{#image metadata.favicon}}{{/image}}
        </div>
        <span class="text-[13px]">
          {{metadata.title.value}}
        </span>
      </div>

      <div class="flex flex-col gap-2 w-full bg-white rounded-lg overflow-hidden border border-gray-200 h-full">
        <div data-app data-customize-trigger="backrgound" class="relative flex flex-col w-full justify-between h-full gap-8 z-10">
          {{#app_bg backrgound}}{{/app_bg}}

          <header class="flex justify-center items-center pt-8">
            <div data-customize-trigger="logo">
              {{#image logo}}{{/image}}
            </div>
          </header>
          <main class="flex flex-col items-center justify-center">
            {{#if status}}
              <div data-main class="flex w-full flex-col items-center justify-center">
                <div data-customize-trigger="action_background" class="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full">
                  <div
                    data-slide-container
                    class="flex bg-white items-center duration-300 transform transition-all flex-grow max-w-full"
                  >
                    <ul data-trigger-container class="p-6 md:p-8 trigger flex flex-col w-full flex-shrink-0 gap-4">
                      {{#each actions}}
                        <li>
                          {{#app_button this @index}}{{/app_button}}
                        </li>
                      {{/each}}
                      <li>
                        <div data-customize-trigger="actions.new">
                          <place-holder class="px-2 py-1 rounded-3xl">
                            <span data-info class="z-10 py-1 px-1">
                              + Add Button
                            </span>
                          </place-holder>
                        </div>
                      </li>
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

                              <span class="ml-2"> {{button.label}} </span>
                            </div>
                            {{> (dynamic_template)}}
                          </div>
                        {{/if}}
                      {{/each}}
                    </div>
                  </div>  
                </div>

                {{#if Bottomline.value}}
                  <div data-customize-trigger="Bottomline" class="relative bg-white font-bold mt-8 px-2 py-1 rounded-md shadow text-blue-900 text-center text-sm">
                    <a>{{ Bottomline.value }}</a>
                  </div>
                {{else}}
                  <div data-customize-trigger="Bottomline" class="min-w-42 mt-8">
                    <place-holder class="px-2">
                      <span data-info class="z-10 py-1 px-1">
                        Add Text
                      </span>
                    </place-holder>
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
            {{#if Copyright.value}}
              <p data-customize-trigger="Copyright" class="text-center text-gray-600">
                {{Copyright.value}}
              </p>
            {{else}}
              <div data-customize-trigger="Copyright">
                <place-holder>
                  <span data-info class="z-10 py-1 px-1">
                    Add Text
                  </span>
                </place-holder>
              </div>
            {{/if}}
          </footer>
        </div>
      </div>
    </div>
    `)
  },

  async install() {
    const buildHash = "<build-hash>".replace("<build-hash>", "") || Date.now();
    const { items } = await fetch(`/manifest-test.json?hash=${buildHash}`)
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
    const appSelector =
      this.mode === MODE.NORMAL ? "[data-app]" : "[data-customizer]";
    $app.replaceWith(fr.querySelector(appSelector));
    this.init();

    // emit event to know markup had injeected into html
    const buildEvent = new Event("@render-done");
    buildEvent.storeConfig = storeConfig;
    buildEvent.eventMap = this.eventMap;
    window.dispatchEvent(buildEvent);
  },

  reRender() {
    const { templates, storeConfig } = this;
    const $appBuilder = document.querySelector(".app-builder");
    const appContent = templates.render(storeConfig);

    $appBuilder.innerHTML = appContent;
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
      this.eventListener({
        $el,
        event: "click",
        listener: () => this.onContentBlockSelect($el),
        layoutUpdate: true,
        maskEvent: true
      })
    );

    const { height } = $slideContainer.getBoundingClientRect();
    $slideContainer.style.setProperty("--root-height", `${height}px`);

    const $backButtons = (this.$backButtons = $slideContainer.querySelectorAll(
      "[data-back]"
    ));

    $backButtons.forEach($el =>
      this.eventListener({
        $el,
        event: "click",
        listener: () => this.goBack(),
        layoutUpdate: true,
        maskEvent: false
      })
    );
  },

  eventHandler(layoutUpdate, listener) {
    if (this.mode === MODE.CUSTOMIZER && layoutUpdate) {
      const layoutUpdate = new Event("@layout-update");
      window.dispatchEvent(layoutUpdate);
    }
    listener();
  },

  eventListener({ $el, event, listener, layoutUpdate = true, maskEvent }) {
    if (this.mode === MODE.CUSTOMIZER && maskEvent) {
      const id = randomId();
      this.eventMap[id] = {
        $el,
        events: { [event]: () => this.eventHandler(layoutUpdate, listener) }
      };

      handleMultiAssignDatasetValue($el, "eventId", id);
      return;
    }

    $el.addEventListener(event, () => {
      this.eventHandler(layoutUpdate, listener);
    });
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

window.app = app;
window.addEventListener("DOMContentLoaded", () => app.install());
