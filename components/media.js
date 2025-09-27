import { MEDIA_TYPE } from "../src/enum";
import { getDataUrl } from "../src/utils";

class MediaControl extends HTMLElement {
  constructor() {
    super();

    this.mediaType = null;
    this.$previewEl = null;
    this.previewData = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    const Q = this.querySelector.bind(this);
    const [$uploadCta, $svgContentCta, mediaType, $actionContainer] = [
      Q('[data-action="upload"]'),
      Q('[data-action="svg-markup"]'),
      Q('input[name="type"]')?.value,
      Q(".media-control__actions")
    ];

    this.$uploadCta = $uploadCta;
    this.$svgContentCta = $svgContentCta;
    this.mediaType = mediaType;
    this.$actionContainer = $actionContainer;

    this.setupPreviewEl();
    this.setupUploadCta();
    this.setupSvgContentBox();

    $uploadCta.addEventListener("click", () => this.openFileExplorer());
    $svgContentCta.addEventListener("click", () => this.openSvgContentBox());
  }

  setupSvgContentBox() {
    const $svgContentTextarea = document.createElement("textarea");
    const $updateSvgContent = document.createElement("button");
    const $cancelSvgContent = document.createElement("button");

    // Update button states
    [
      { $el: $updateSvgContent, title: "Update" },
      { $el: $cancelSvgContent, title: "Cancel" }
    ].forEach(({ $el, title }) => {
      $el.classList.add("button", "basis-0", "grow", "shrink-0");
      $el.innerHTML = title;
    });

    $svgContentTextarea.classList.add(
      "w-full",
      "h-full",
      "text-sm",
      "p-2",
      "resize-none"
    );

    $cancelSvgContent.addEventListener("click", () =>
      this.cancelSvgUpdateOperation()
    );

    $updateSvgContent.addEventListener("click", () => this.updateSvgMarkup());

    this.$svgContentTextarea = $svgContentTextarea;
    this.$updateSvgContent = $updateSvgContent;
    this.$cancelSvgContent = $cancelSvgContent;
  }

  updateSvgMarkup() {
    const { $svgContentTextarea, $previewEl } = this;
    const updatedSvgMarkup = $svgContentTextarea.value;
    $svgContentTextarea.remove();

    this._svgMarkup = updatedSvgMarkup;
    $previewEl.innerHTML = updatedSvgMarkup;

    // Reset container to old state
    $previewEl.classList.add("w-32", "image-bg");
    $previewEl.classList.remove("w-full");

    // revert action button state
    this.updateActionButons(false);
  }

  cancelSvgUpdateOperation() {
    const { $svgContentTextarea, $previewEl, _svgMarkup } = this;
    $svgContentTextarea.remove();
    $previewEl.innerHTML = _svgMarkup;

    // Reset container to old state
    $previewEl.classList.add("w-32", "image-bg");
    $previewEl.classList.remove("w-full");

    // revert action button state
    this.updateActionButons(false);
  }

  updateActionButons(svgEditMode = true) {
    // Update buttons
    const {
      $uploadCta,
      $svgContentCta,
      $updateSvgContent,
      $cancelSvgContent,
      $actionContainer
    } = this;

    if (!svgEditMode) {
      [$updateSvgContent, $cancelSvgContent].forEach($el => $el.remove());
      [$uploadCta, $svgContentCta].forEach($el =>
        $actionContainer.appendChild($el)
      );

      return;
    }

    // Show svg related buttons
    [$uploadCta, $svgContentCta].forEach($el => $el.remove());
    [$updateSvgContent, $cancelSvgContent].forEach($el =>
      $actionContainer.appendChild($el)
    );
  }

  openSvgContentBox() {
    const { mediaType } = this;

    if (mediaType !== MEDIA_TYPE.SVG_MARKUP) {
      this.mediaType = MEDIA_TYPE.SVG_MARKUP;
      this.updatePreviewEL();
    }

    const { $previewEl, $svgContentTextarea } = this;
    $previewEl.classList.remove("w-32", "image-bg");
    $previewEl.classList.add("w-full");
    this._svgMarkup = $previewEl.innerHTML;
    $svgContentTextarea.value = this._svgMarkup.trim();

    $previewEl.innerHTML = "";
    $previewEl.appendChild($svgContentTextarea);
    $svgContentTextarea.focus();

    this.updateActionButons();
  }

  setupPreviewEl() {
    const { mediaType } = this;
    const Q = this.querySelector.bind(this);
    const [$imageEl, $svgEl, $noneEl] = [
      Q(".media-control__preview-img"),
      Q(".media-control__preview-svg"),
      Q(".media-control__preview-none")
    ];

    switch (mediaType) {
      case MEDIA_TYPE.DEFAULT: {
        this.$previewEl = $imageEl;
        break;
      }

      case MEDIA_TYPE.SVG_MARKUP: {
        this.$previewEl = $svgEl;
        break;
      }

      default: {
        this.$previewEl = $noneEl;
      }
    }

    this.$previewEls = { $imageEl, $svgEl, $noneEl };
  }

  updatePreviewEL() {
    const { $previewEls, mediaType } = this;
    const { $imageEl, $svgEl, $noneEl } = $previewEls;

    switch (mediaType) {
      case MEDIA_TYPE.DEFAULT: {
        this.$previewEl = $imageEl;
        [$svgEl, $noneEl].forEach($el => $el.classList.add("hidden"));
        break;
      }

      case MEDIA_TYPE.SVG_MARKUP: {
        this.$previewEl = $svgEl;
        [$imageEl, $noneEl].forEach($el => $el.classList.add("hidden"));
        break;
      }

      default: {
        this.$previewEl = $noneEl;
        [$imageEl, $svgEl].forEach($el => $el.classList.add("hidden"));
      }
    }

    this.$previewEl.classList.remove("hidden");
  }

  setupUploadCta() {
    const $file = document.createElement("input");
    $file.type = "file";

    $file.addEventListener("change", e => this.onFileChange(e));

    this.$file = $file;
  }

  setPreview() {
    const { mediaType, previewData, $previewEl } = this;

    switch (mediaType) {
      case MEDIA_TYPE.DEFAULT: {
        $previewEl.src = previewData;
        break;
      }

      case MEDIA_TYPE.SVG_MARKUP: {
        $previewEl.innerHTML = previewData;
        break;
      }
    }

    $previewEl.classList.remove("hidden");
  }

  async onFileChange() {
    const { $file, mediaType } = this;
    const [file] = $file.files;
    const dataURL = await getDataUrl(file);

    if (mediaType !== MEDIA_TYPE.DEFAULT) {
      this.mediaType = MEDIA_TYPE.DEFAULT;
      this.updatePreviewEL();
    }

    this.previewData = dataURL;
    this.setPreview();
  }

  openFileExplorer() {
    const { $file } = this;
    $file.click();
  }
}

customElements.define("media-control", MediaControl);
