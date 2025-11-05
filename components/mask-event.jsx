import classNames from "classnames";
import React, { cloneElement, forwardRef, useContext } from "react";
import { AppContext, RENDER_MODE } from "../src/app-context";

const MaskEvent = forwardRef(({ children }, ref) => {
  const { state } = useContext(AppContext);

  const maskedClick = e => {
    e.stopPropagation();
    children.props.onClick();
  };

  const onClick = () => {
    if (state.renderMode === RENDER_MODE.NORMAL) {
      children.props.onClick();
    }
  };

  return cloneElement(children, {
    ref,
    onClick,
    className: classNames(
      "relative [&:hover>.event-trigger]:flex",
      children.props.className
    ),
    children: (
      <>
        {children.props.children}

        {state.renderMode === RENDER_MODE.CUSTOMIZER ? (
          <span
            onClick={maskedClick}
            className="event-trigger absolute hidden w-[10px] h-[10px] bg-blue-500 rounded-full mr-5 right-0"
          ></span>
        ) : null}
      </>
    )
  });
});

export default MaskEvent;
