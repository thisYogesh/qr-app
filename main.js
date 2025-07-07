const app = {
  $contentContainer: null,
  $slideContainer: null,
  $contentBlocks: [],
  $backButtons: [],
  canShare: navigator.canShare(),
  // $triggerContainer: null,

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

    this.slideTo(trigger);
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
    shareLocation() {
      const { canShare } = this;
      alert(`share ${canShare}`);

      /**
       * await navigator.share({
            title: 'Awesome Page',
            text: 'Check out this awesome page!',
            url: window.location.href,
          });
       */

      if (!canShare) return;
    },
  },
};

window.addEventListener("DOMContentLoaded", () => app.init());
