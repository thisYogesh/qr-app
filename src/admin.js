import Customizer from "./customizer";

window.Customizer = Customizer;

window.addEventListener("@render-done", e => {
  Customizer.init(e);

  window.addEventListener("resize", () =>
    Customizer.resetAndDisableCustomizeTrigger()
  );
});

window.addEventListener("@layout-update", () => {
  Customizer.layoutUpdateInProgress = true;
  Customizer.resetAndDisableCustomizeTrigger();

  setTimeout(() => (Customizer.layoutUpdateInProgress = false), 500);
});
