/**
 * The value nodes in the workspace for MIST.
 *
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// +-------+---------------------------------------------------------
// | Notes |
// +-------+
/* 1. The trashcan function creates a trashcan icon on the top left of the function node. The onClick
      attrribute on that deletes the node from the workspace

   2. Props received from the workspace contain the following:
   - name : String; name of the node
   - key : int; unique key attribute 
   - index : int; index of the ndoe
   - x : int; x coordinate
   - y : int; y coordinate 
   - offsetX : int; to account for the shift in the x-coordinate 
   - offsetY : int; to account for the shift in the y-coordinate
   - numInputs : int; number of lines coming into the node
   - numOutlets : int; number of outlets of the node
   - renderFunction : String; the expression in the node
   - updateNodePosition : function; Updates node position in the workspace
   - updateLinePosition : function; Updates line position in the workspace
   - outletClicked : function; Listens to clicks on the outlets
   - dblClickHandler : function; Listens to double clicks on the function for generation of 
                       temporary line 
   - removeNode : function; removes node from the workspace

   3. The dragBoundFunc attribute on the group helps keep the value node within the 
      boundaries of the workspace. 

   4. UseStrictMode is a good react-konva practice.
  

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useState, useRef } from "react";
import { Rect, Group, Text, Image } from "react-konva";
import Konva from "konva";
import Portal from "./Portal";
import gui from "./mistgui-globals.js";
import MISTImage from "./MISTImage";
import useImage from "use-image";
import nodeDimensions from "./globals-nodes-dimensions.js";
import { width, height, funBarHeight, menuHeight } from "./globals.js";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function ValNode(props) {
  const name = props.name;
  const x = props.x;
  const y = props.y;
  const index = props.index;
  const rep = gui.values[name].rep;
  const [renderFunction, setRenderFunction] = useState(gui.values[name].rep);
  const [showImage, setShowImage] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./trash.png"));
  const groupRef = useRef(null);
  const [formValue, setFormValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // +----------------------------+------------------------------------
  // | Trashcan                   |
  // +----------------------------+

  function Trashcan() {
    return (
      <Image
        image={image}
        x={nodeDimensions.valueTrashX}
        y={nodeDimensions.valueTrashY}
        width={14}
        height={14}
        shadowColor={trashHovered ? "red" : "cyan"}
        shadowBlur={5}
        visible={hovered}
        onMouseEnter={() => {
          setTrashHovered(true);
        }}
        onMouseLeave={() => {
          setTrashHovered(false);
          setHovered(false);
        }}
        onClick={() => props.removeNode(props.index)}
      />
    );
  }

  // +----------------------------+
  // | Trashcan                   |
  // +----------------------------+------------------------------------

  // +----------------------------------------+------------------------
  // | Entire Value Group                     |
  // +----------------------------------------+

  return (
    <Group
      x={x}
      y={y}
      ref={groupRef}
      draggable
      // helps keep the function nodes in the designated workspace area
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > width - nodeDimensions.valueWidth) {
          pos.x = width - nodeDimensions.valueWidth;
        }
        if (pos.y < menuHeight) {
          pos.y = menuHeight;
        }
        if (pos.y > height - funBarHeight - nodeDimensions.valueWidth) {
          pos.y = height - funBarHeight - nodeDimensions.valueWidth;
        }
        return pos;
      }}
      onDragStart={(e) => {
        e.target.setAttrs({
          shadowOffset: {
            x: 15,
            y: 15,
          },
          scaleX: 1.1,
          scaleY: 1.1,
        });
      }}
      onDragEnd={(e) => {
        e.target.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
        });
        // Updates the x & y coordinates once the node has stopped dragging
        props.updateNodePosition(
          index,
          e.currentTarget.x(),
          e.currentTarget.y()
        );
      }}
      onDragMove={(e) => {
        // Updates the line position dynamically while the node is being dragged
        props.updateLinePosition(
          index,
          "val",
          e.currentTarget.x(),
          e.currentTarget.y()
        );
      }}
      onClick={(e) => {
        props.clickHandler(index);
      }}
      onDblClick={(e) => {
        // Generates the temporary line when double clicked
        props.dblClickHandler(index);
      }}
    >
      <Group
        onMouseEnter={(e) => {
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1.07,
              scaleY: 1.07,
            });
            return 0;
          });
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1,
              scaleY: 1,
            });
            return 0;
          });
        }}
      >
        <Rect
          x={nodeDimensions.valueOffset}
          y={0}
          width={nodeDimensions.valueSideLength}
          height={nodeDimensions.valueSideLength}
          fill={gui.values[name].color}
          cornerRadius={10}
          lineJoin={"round"}
          rotation={45}
          stroke={gui.values[name].color}
          strokeWidth={nodeDimensions.functionStrokeWidth}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
          _useStrictMode
        />
        {rep === "#" ? (
          <Portal>
            <form
              id="form#"
              style={{
                position: "absolute",
                left: x + props.offsetX + 20,
                top: y + props.offsetY + 10,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                if(parseFloat(formValue)!== null) {
                  setRenderFunction(formValue);
                  props.updateHashValue(index, formValue);
                  setSubmitted(true);
                } else {
                  console.log("Invalid Number");
                }
                return false;
              }}
            >
              <label>
                <input
                  type="text"
                  placeholder="#"
                  style={{
                    width: 0.45 * nodeDimensions.valueWidth,
                    height: 0.45 * nodeDimensions.valueWidth,
                    backgroundColor: "#D8AB24",
                    border: "none"
                  }}
                  onChange={(e) => {
                    setFormValue(e.target.value);
                  }}
                />
              </label>
            </form>
            <div></div>
          </Portal>
        ) : (
          <Text
            text={renderFunction}
            fontFamily={gui.globalFont}
            fill={"black"}
            fontSize={gui.nodeFontSize}
            x={0}
            y={0}
            width={nodeDimensions.valueWidth}
            height={nodeDimensions.valueWidth}
            align={"center"}
            verticalAlign={"middle"}
            _useStrictMode
          />
        )}
        <Trashcan />
      </Group>
      {showImage ? (
        <Portal>
          <MISTImage //Mini image that can be seen at the bottom right of the node
            onClick={() => setShowImage(!showImage)}
            x={x + nodeDimensions.valueImageBoxOffset + props.offsetX}
            y={y + nodeDimensions.valueImageBoxOffset + props.offsetY}
            width={nodeDimensions.renderSideLength}
            height={nodeDimensions.renderSideLength}
            renderFunction={renderFunction}
            automated={false}
          />
        </Portal>
      ) : (
        <Rect
          onClick={() => setShowImage(!showImage)}
          name={"imageBox"}
          x={nodeDimensions.valueImageBoxOffset}
          y={nodeDimensions.valueImageBoxOffset}
          width={nodeDimensions.imageBoxSideLength}
          height={nodeDimensions.imageBoxSideLength}
          fill={gui.imageBoxColor}
          expanded={false}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
        />
      )}
    </Group>
  );
  // +----------------------------------------+
  // | Entire Value Group                     |
  // +----------------------------------------+----------------------
}

export default ValNode;

