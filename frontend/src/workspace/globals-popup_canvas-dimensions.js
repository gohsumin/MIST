import React, { createContext } from "react";

export const popupContext = createContext();

export function PopupContextProvider(props) {
  const width = props.width;
  const height = props.height;
  const canvasWidth = width * 0.35;
  const canvasX = (width - canvasWidth) / 2;
  const canvasY = canvasWidth * 0.07;
  const canvasMargin = width * 0.02;

  const textfieldX = canvasX + 2 * canvasMargin;
  const textfieldY = canvasY + canvasMargin * 0.5;
  const textfieldWidth = canvasWidth - 4 * canvasMargin;
  const textfieldHeight = canvasWidth * 0.08;

  const imageX = canvasX + canvasMargin;
  const imageY = textfieldY + textfieldHeight + canvasMargin * 0.5;
  const imageWidth = canvasWidth - 2 * canvasMargin;
  const imageHeight = imageWidth;

  const rfTextX = canvasX + canvasMargin;
  const rfTextY = imageY + imageHeight;
  const rfTextWidth = canvasWidth - 2 * canvasMargin;
  const rfTextHeight = canvasWidth * 0.08;

  const buttonMargin = canvasWidth / 70;
  const buttonOffset = (canvasWidth - 2 * canvasMargin) / 4;
  const buttonX = canvasX + canvasMargin; // divide by the number of buttons
  const buttonY = rfTextY + rfTextHeight;
  const buttonWidth = buttonOffset - 2 * buttonMargin;
  const buttonHeight = buttonWidth * 0.28;

  const canvasHeight = buttonY + buttonHeight + canvasMargin;

  return (
    <popupContext.Provider
      value={{
        canvasX: canvasX,
        canvasY: canvasY,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        canvasMargin: canvasMargin,
        textfieldX: textfieldX,
        textfieldY: textfieldY,
        textfieldWidth: textfieldWidth,
        textfieldHeight: textfieldHeight,
        imageX: imageX,
        imageY: imageY,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        buttonMargin: buttonMargin,
        buttonOffset: buttonOffset,
        buttonX: buttonX,
        buttonY: buttonY,
        buttonWidth: buttonWidth,
        buttonHeight: buttonHeight,
        rfTextX: rfTextX,
        rfTextY: rfTextY,
        rfTextWidth: rfTextWidth,
        rfTextHeight: rfTextHeight,
      }}
    >
      {props.children}
    </popupContext.Provider>
  );
}
