import { MEDIA_TYPE } from "../src/enum";
import { getDataUrl } from "../src/utils";

class MediaControl extends HTMLElement {
  constructor() {
    super();

    this.ogMediaType = null;
    this.currentMediaType = null;
    this.$previewEl = null;
    this.previewData = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    const Q = this.querySelector.bind(this);
    const [
      $uploadCta,
      $svgContentCta,
      currentMediaType,
      $actionContainer,
      $previewArea
    ] = [
      Q('[data-action="upload"]'),
      Q('[data-action="svg-markup"]'),
      Q('input[name="type"]')?.value,
      Q(".media-control__actions"),
      Q(".media-control__preview")
    ];

    this.$uploadCta = $uploadCta;
    this.$svgContentCta = $svgContentCta;
    this.$actionContainer = $actionContainer;
    this.$previewArea = $previewArea;
    this.ogMediaType = this.currentMediaType = currentMediaType;

    this.setupPreviewEl();
    this.setupUploadCta();
    this.setupSvgContentBox();

    $uploadCta.addEventListener("click", () => this.openFileExplorer());
    $svgContentCta.addEventListener("click", () => this.openSvgContentBox());

    $previewArea.addEventListener("dragover", e => this.onDragOver(e));
    $previewArea.addEventListener("dragleave", () => this.onDragLeave());
    $previewArea.addEventListener("dragend", e => this.onDragLeave());
    $previewArea.addEventListener("drop", e => this.onDragDrop(e));
  }

  async onDragDrop(e) {
    e.preventDefault();
    const { $previewArea } = this;
    try {
      const [file] = e.dataTransfer.files;

      const dataURL = await getDataUrl(file);
      this.setImagePreview(dataURL);

      // Remove active state
      $previewArea.classList.add("border-gray-300");
      $previewArea.classList.remove("border-blue-700", "border-red-500");
    } catch {
      // Remove active state
      $previewArea.classList.add("border-gray-300");
      $previewArea.classList.remove("border-blue-700", "border-red-500");
    }
  }

  onDragLeave() {
    const { $previewArea } = this;
    $previewArea.classList.add("border-gray-300");
    $previewArea.classList.remove("border-blue-700", "border-red-500");
  }

  onDragOver(e) {
    e.preventDefault();

    const { $previewArea } = this;
    const { types } = e.dataTransfer;

    if (!types.includes("Files")) {
      $previewArea.classList.remove("border-gray-300");
      $previewArea.classList.add("border-red-500");
      return;
    }

    $previewArea.classList.remove("border-gray-300");
    $previewArea.classList.add("border-blue-700");
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
    const { $svgContentTextarea, $previewEl, _svgMarkup, ogMediaType } = this;
    $svgContentTextarea.remove();

    this.currentMediaType = ogMediaType;
    this.updatePreviewEL();

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
    const { currentMediaType } = this;

    if (currentMediaType !== MEDIA_TYPE.SVG_MARKUP) {
      this.currentMediaType = MEDIA_TYPE.SVG_MARKUP;
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
    const { currentMediaType } = this;
    const Q = this.querySelector.bind(this);
    const [$imageEl, $svgEl, $noneEl] = [
      Q(".media-control__preview-img"),
      Q(".media-control__preview-svg"),
      Q(".media-control__preview-none")
    ];

    switch (currentMediaType) {
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
    const { $previewEls, currentMediaType } = this;
    const { $imageEl, $svgEl, $noneEl } = $previewEls;

    switch (currentMediaType) {
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

  setImagePreview(dataURL) {
    const { currentMediaType, $previewEl } = this;

    if (currentMediaType === MEDIA_TYPE.DEFAULT) {
      $previewEl.src = dataURL;
      $previewEl.classList.remove("hidden");
    }
  }

  async onFileChange() {
    const { $file, currentMediaType } = this;
    const [file] = $file.files;
    const dataURL = await getDataUrl(file);

    if (currentMediaType !== MEDIA_TYPE.DEFAULT) {
      this.currentMediaType = MEDIA_TYPE.DEFAULT;
      this.updatePreviewEL();
    }

    this.setImagePreview(dataURL);
  }

  openFileExplorer() {
    const { $file } = this;
    $file.click();
  }
}

customElements.define("media-control", MediaControl);
