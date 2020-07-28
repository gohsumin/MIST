/**
 * The function nodes in the workspace for MIST.
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
   - funClicked : function; Listens to clicks on the node
   - outletClicked : function; Listens to clicks on the outlets
   - dblClickHandler : function; Listens to double clicks on the function for generation of 
                       temporary line 
   - removeNode : function; removes node from the workspace
   - hoverShadowColor : String; changes hover color based on theme

   3. The dragBoundFunc attribute on the group helps keep the function node within the 
      boundaries of the workspace. 

   4. UseStrictMode is a good react-konva practice.
  

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------


// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useState, useEffect, useRef } from "react";
import { Rect, Group, Text, Shape, Image } from "react-konva";
import Konva from "konva";
import Portal from "./Portal";
import gui from "./mistgui-globals.js";
import MISTImage from "./MISTImage";
import useImage from "use-image";
import nodeDimensions from "./globals-nodes-dimensions.js";
import globals from "./globals.js";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function FunNode(props) {
  const name = props.name;
  const index = props.index;
  const x = props.x;
  const y = props.y;
  const rep = gui.functions[name].rep;
  const numOutlets = props.numOutlets;
  const [showImage, setShowImage] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./trash.png"));
  const groupRef = useRef(null);

// +----------------------------+------------------------------------
// | Trashcan                   |
// +----------------------------+

  function Trashcan() {
    return (
      <Image
        image={image}
        x={nodeDimensions.functionTrashX}
        y={nodeDimensions.functionTrashY}
        width={14}
        height={14}
        shadowColor={trashHovered ? "red" : "cyan"}
        shadowBlur={5}
        visible={hovered} //Only visible when hovering over node
        onMouseEnter={() => {
          setTrashHovered(true);
        }}
        onMouseLeave={() => {
          setTrashHovered(false);
          setHovered(false);
        }}
        onClick={() => props.removeNode(props.index)} //Removes the node from the workspace
      />
    );
  }

// +----------------------------+
// | Trashcan                   |
// +----------------------------+------------------------------------

  useEffect(() => {
    if (!props.renderFunction) {
      setShowImage(false);
    }
  }, [props.renderFunction]); //Re-renders whenever the render function changes

// +----------------------------------------+------------------------
// | Entire Function Group                  |
// +----------------------------------------+

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable

      // helps keep the function nodes in the designated workspace area
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > window.innerWidth - nodeDimensions.functionWidth) {
          pos.x = window.innerWidth - nodeDimensions.functionWidth;
        }
        if (pos.y < globals.menuHeight) {
          pos.y = globals.menuHeight;
        }
        if (
          pos.y >
          window.innerHeight -
            globals.funBarHeight -
            nodeDimensions.functionWidth
        ) {
          pos.y =
            window.innerHeight -
            globals.funBarHeight -
            nodeDimensions.functionWidth;
        }
        return pos;
      }}

      onDragStart={(e) => {
        e.target.setAttrs({
          duration: 0.5,
          shadowOffset: {
            x: 5,
            y: 5,
          },
          shadowBlur: 6,
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
        });
        // Updates the x & y coordinates once the node has stopped dragging
        props.updateNodePosition(index, e.currentTarget.x(), e.currentTarget.y());
      }}

      onDragMove={(e) => {
        // Updates the line position dynamically while the node is being dragged
        props.updateLinePosition(index, 'fun', e.currentTarget.x(), e.currentTarget.y());
      }}

      onClick={(e) => {
        if (e.target.attrs.name) {
          props.outletClicked(
            index,
            parseInt(e.target.attrs.name.substring(6)) - 1
          );
        } else {
          props.funClicked(index);
        }
      }}

      onDblClick={() => {
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
              scaleY: 1.07
            })
            return 0;
          })
          setHovered(true);
        }}

        onMouseLeave={(e) => {
          setHovered(false);
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1,
              scaleY: 1
            })
            return 0;
          })
        }}
      >
        <Rect
          x={0}
          y={0}
          width={nodeDimensions.functionWidth}
          height={
            props.numOutlets <= 3
              ? nodeDimensions.functionWidth
              : nodeDimensions.functionWidth +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          fill={gui.functions[name].color}
          cornerRadius={10}
          shadowColor={
            hovered ? (trashHovered ? "red" : props.hoverShadowColor) : "black"
          }
          shadowOffset={{ x: hovered ? 0 : 1, y: hovered ? 0 : 1 }}
          shadowBlur={3}
          _useStrictMode
        />
        <Text
          text={rep}
          fontFamily={gui.globalFont}
          fill={"white"}
          fontSize={gui.nodeFontSize}
          x={0}
          y={0}
          width={nodeDimensions.functionWidth}
          height={
            props.numOutlets <= 3
              ? nodeDimensions.functionWidth
              : nodeDimensions.functionWidth +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          align={"center"}
          verticalAlign={"middle"}
          _useStrictMode
        />
        <Trashcan />
      </Group>
      {showImage ? (
        <Portal>
          <MISTImage //Mini image that can be seen at the bottom right of the node
            onClick={() => setShowImage(false)}
            x={x + nodeDimensions.functionImageBoxOffset + props.offsetX}
            y={y + nodeDimensions.functionImageBoxOffset + props.offsetY}
            width={nodeDimensions.renderSideLength}
            height={nodeDimensions.renderSideLength}
            renderFunction={props.renderFunction ? props.renderFunction : ""}
            automated={false}
          />
        </Portal>
      ) : (
        <Rect
          onClick={() => {
            console.log(props.renderFunction);
            if (props.renderFunction) {
              setShowImage(true);
            }
          }}
          name={"imageBox"}
          x={nodeDimensions.functionImageBoxOffset}
          y={
            props.numOutlets <= 3
              ? nodeDimensions.functionImageBoxOffset
              : nodeDimensions.functionImageBoxOffset +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          width={nodeDimensions.imageBoxSideLength}
          height={nodeDimensions.imageBoxSideLength}
          fill={gui.imageBoxColor}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
          expanded={false}
          visible={typeof props.renderFunction === 'string'}
        />
      )}
      {name === "rgb"
        ? ["red", "green", "blue"].map((u, i) => (
            <Shape
              sceneFunc={function (context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(
                  -gui.bezPoint,
                  -gui.bezPoint,
                  -gui.bezPoint,
                  gui.bezPoint,
                  0,
                  0
                );
                context.closePath();
                context.fillStrokeShape(this);
              }}
              name={"outlet" + (i + 1)}
              key={i} // to silence a warning
              x={nodeDimensions.outletXOffset}
              y={i * nodeDimensions.outletYOffset + nodeDimensions.outletStartY}
              fillRadialGradientStartPoint={{ x: -19, y: -5 }}
              fillRadialGradientStartRadius={3}
              fillRadialGradientEndPoint={{ x: -15, y: -5 }}
              fillRadialGradientEndRadius={15}
              fillRadialGradientColorStops={[0, u, 1, "dark" + u]}
              onMouseOver={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.2,
                  scaleY: 1.2,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onMouseOut={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
            />
          ))
        : [...Array(numOutlets)].map((u, i) => (
            <Shape
              sceneFunc={function (context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(
                  -gui.bezPoint,
                  -gui.bezPoint,
                  -gui.bezPoint,
                  gui.bezPoint,
                  0,
                  0
                );
                context.closePath();
                context.fillStrokeShape(this);
              }}
              name={"outlet" + (i + 1)}
              x={nodeDimensions.outletXOffset}
              key={i}
              y={i * nodeDimensions.outletYOffset + nodeDimensions.outletStartY}
              fillRadialGradientStartPoint={{ x: -19, y: -5 }}
              fillRadialGradientStartRadius={3}
              fillRadialGradientEndPoint={{ x: -15, y: -5 }}
              fillRadialGradientEndRadius={15}
              fillRadialGradientColorStops={[
                0,
                gui.outletColor,
                1,
                gui.outletColor2,
              ]}
              onMouseOver={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.2,
                  scaleY: 1.2,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onMouseOut={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
            />
          ))}
    </Group>
  );
// +----------------------------------------+
// | Entire Function Group                  |
// +----------------------------------------+----------------------
}
export default FunNode;
