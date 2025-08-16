window.addEventListener("@build", () => {
  const $customisers = document.querySelectorAll("[data-customize]");

  $customisers.forEach($el => {
    const $trigger = document.createElement("span");

    $trigger.dataset.customizeTrigger = true;
    $trigger.classList.add("absolute", "hidden", "border");

    $el.$trigger = $trigger;
    document.body.append($trigger);

    $el.addEventListener("mouseenter", e => {
      const { $trigger } = e.target;
      const { height, width, left, top } = e.target.getBoundingClientRect();

      $trigger.style.setProperty("height", height + "px");
      $trigger.style.setProperty("width", width + "px");

      $trigger.style.setProperty("left", left + "px");
      $trigger.style.setProperty("top", top + "px");

      $trigger.classList.remove("hidden");
    });
  });
});
