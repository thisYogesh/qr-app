import React from "react";
import { IfElse } from "../helpers";
import Media from "./media";
import CustomizeTrigger from "./customize-trigger";
import MaskEvent from "./mask-event";

export default function ActionButton({ data, index, onClick }) {
  const { button, template } = data;
  const { background_color = {}, icon, label, href = "" } = button;
  const { value: bg_color = "#000", text_color = "#fff" } = background_color;

  return (
    <CustomizeTrigger data={button}>
      <MaskEvent>
        <a
          onClick={onClick}
          data-trigger={template ? `#template-${index}` : ""}
          href={href ? href : undefined}
          target={href ? "_blank" : undefined}
          style={{ "--bg-color": bg_color, "--text-color": text_color }}
          className="app-button w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-105"
        >
          {IfElse(icon, () => (
            <span className="flex h-5 w-5">
              <Media data={icon} />
            </span>
          ))}
          {label}
        </a>
      </MaskEvent>
    </CustomizeTrigger>
  );
}
