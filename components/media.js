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
    const [$uploadCta, $svgContentBox, mediaType] = [
      Q('[data-action="upload"]'),
      Q('[data-action="svg-markup"]'),
      Q('input[name="type"]')?.value
    ];

    this.$uploadCta = $uploadCta;
    this.$svgContentBox = $svgContentBox;
    this.mediaType = mediaType;

    this.setupPreviewEl();
    this.setupUploadCta();
    this.setupSvgContentBox();

    $uploadCta.addEventListener("click", () => this.openFileExplorer());
    $svgContentBox.addEventListener("click", () => this.enableSvgContentBox());
  }

  setupSvgContentBox() {
    const $svgContentBox = document.createElement("textarea");
    $svgContentBox.classList.add(
      "w-full",
      "h-full",
      "text-sm",
      "p-2",
      "resize-none"
    );
    this.$svgContentBox = $svgContentBox;
  }

  enableSvgContentBox() {
    const { mediaType } = this;

    if (mediaType !== MEDIA_TYPE.SVG_MARKUP) {
      this.mediaType = MEDIA_TYPE.SVG_MARKUP;
      this.updatePreviewEL();
    }

    const { $previewEl, $svgContentBox } = this;
    $previewEl.classList.remove("w-32", "image-bg");
    $previewEl.classList.add("w-full");
    this._svgMarkup = $previewEl.innerHTML;
    $svgContentBox.value = this._svgMarkup.trim();

    $previewEl.innerHTML = "";
    $previewEl.appendChild($svgContentBox);
    $svgContentBox.focus();
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
