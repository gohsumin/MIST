import React, { useState } from "react";
import Portal from "./Portal";
import { Rect, Group, Text } from "react-konva";
import { Link } from "react-router-dom";
import gui from "./mistgui-globals.js";
import { width, height } from "./globals";
import popupDimensions from "./globals-popup_canvas-dimensions";
import MISTImage from "./MISTImageCreate";
import "./../design/styleSheets/FunBar.css";

function PopupCanvas(props) {
  const [imageName, setImageName] = useState("");

  return (
    <>
      <Background {...props} />
      <Portal>
        <PortalTextBox {...props} setImageName={setImageName} />
        <PortalImage {...props} />
        <PortalFunction {...props} />
      </Portal>
      <PortalButtons {...props} imageName={imageName} />
    </>
  );
}

function Background(props) {
  return (
    <Group x={props.x} y={props.y}>
      <Rect
        width={width}
        height={height}
        fill={"black"}
        opacity={0.7}
      />
      <Rect
        x={popupDimensions.canvasX}
        y={popupDimensions.canvasY}
        width={popupDimensions.canvasWidth}
        height={popupDimensions.canvasHeight}
        fill={"white"}
        cornerRadius={30}
        opacity={0.8}
      />
    </Group>
  );
}

function PortalTextBox(props) {
  return (
    <div // Text box: "Enter Name of Image"
      style={{
        position: "absolute",
        top: props.top + popupDimensions.textfieldY,
        left: props.left + popupDimensions.textfieldX,
        fontSize: gui.popTextFontSize,
        fontFamily: gui.functionFont,
        width: popupDimensions.textfieldWidth,
        height: popupDimensions.textfieldHeight,
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <input
        type={"text"}
        placeholder={"Enter Name Of Image"}
        style={{
            width: popupDimensions.textfieldWidth,
            height: popupDimensions.textfieldHeight,
          border: "2px solid #008CBA",
          textAlign: "center",
        }}
        onChange={(e) => props.setImageName(e.target.value)}
      />
    </div>
  );
}

function PortalImage(props) {
  return (
    <MISTImage
      x={props.left + popupDimensions.imageX}
      y={props.top + popupDimensions.imageY}
      width={popupDimensions.imageWidth}
      height={popupDimensions.imageHeight}
      //renderFunction={"x"}
      renderFunction={props.renderFunction.renderFunction}
      automated={true}
    />
  );
}

function PortalFunction(props) {
  return (
    <div
      style={{
        position: "absolute",
        top: props.top + popupDimensions.rfTextY,
        left: props.left + popupDimensions.rfTextX,
        fontSize: 20,
        textAlign: "center",
        width: popupDimensions.rfTextWidth,
        height: popupDimensions.rfTextHeight,
        overflow: "auto",
      }}
    >
      <p style={{
          width: popupDimensions.rfTextWidth,
          height: popupDimensions.rfTextHeight,
          fill: 'red'
      }}>{props.renderFunction.renderFunction}</p>
    </div>
  );
}

function PortalButtons(props) {
  return (
    <Group
      x={props.x + popupDimensions.buttonX}
      y={props.y + popupDimensions.buttonY}
    >
      {["Cancel", "Download"].map((u, i) => {
        return (
          <Group
            x={popupDimensions.buttonMargin + i * popupDimensions.buttonOffset}
            onClick={() => {
              if (u === "Cancel") {
                props.closePortal();
              }
            }}
          >
            <Rect
              fill={"white"}
              stroke={"#008CBA"}
              strokeWidth={2}
              width={popupDimensions.buttonWidth}
              height={popupDimensions.buttonHeight}
            />
            <Text
              fontSize={15}
              text={u}
              width={popupDimensions.buttonWidth}
              height={popupDimensions.buttonHeight}
              align={"center"}
              verticalAlign={"middle"}
            />
          </Group>
        );
      })}
      <SaveButton {...props} index={2} />
      <ExpertButton {...props} index={3} />
    </Group>
  );
}

function SaveButton(props) {
  const [imageExists, setImageExists] = useState("initial");

  function SaveImage() {
    //var newName = props.imageName;
    //newName = removeOuterWhiteSpace(newName);
    //var response = getImageExists(newName);
    console.log("response = " + imageExists);
  }

  function getImageExists(title) {
    let url = "api/?action=imageexists&title=" + title;
    fetch(url)
      .then((req) => req.json())
      .then((exists) => setImageExists(exists));
  }

  return (
    <Group
      x={
        popupDimensions.buttonMargin +
        props.index * popupDimensions.buttonOffset
      }
      onClick={() => SaveImage()}
    >
      <Rect
        fill={"white"}
        stroke={"#008CBA"}
        strokeWidth={2}
        width={popupDimensions.buttonWidth}
        height={popupDimensions.buttonHeight}
      />
      <Text
        fontSize={15}
        text={"Save"}
        width={popupDimensions.buttonWidth}
        height={popupDimensions.buttonHeight}
        align={"center"}
        verticalAlign={"middle"}
      />
    </Group>
  );
}

function ExpertButton(props) {
  return (
    <Group
      x={
        popupDimensions.buttonMargin +
        props.index * popupDimensions.buttonOffset
      }
    >
      <Rect
        fill={"white"}
        stroke={"#008CBA"}
        strokeWidth={2}
        width={popupDimensions.buttonWidth}
        height={popupDimensions.buttonHeight}
      />
      <Text
        fontSize={15}
        text={"Expert"}
        width={popupDimensions.buttonWidth}
        height={popupDimensions.buttonHeight}
        align={"center"}
        verticalAlign={"middle"}
      />
    </Group>
  );
}

/**
 * removeOuterWhiteSpace takes a string and removes white space at the beginning and end
 * of the string, but not the white space in the middle of the string.
 * returns a string
 */
var removeOuterWhiteSpace = function (string) {
  string = string.replace(/^ */, "");
  string = string.replace(/ *$/, "");
  return string;
};

export default PopupCanvas;