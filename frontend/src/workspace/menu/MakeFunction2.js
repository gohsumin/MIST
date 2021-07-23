/**
 * This file creates the Function Nodes for the Menu bar.
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
/*  1. The parameters required are as follows: 
    - addNode : function; Calls the pushNode in the index.js once node has been dropped in 
                the workspace
    - funName : String; Name of the function node
    - x : int; x coordinate
    - y : int; y coordinate 
    - vis : boolean; condition to either display or not display the function nodes on the menu bar
    - index : int; index of the node
    - changeKey : function; This gets called from MakeFunctions and MakeValues to change the group's
                  key to trigger a re-render (so that the node goes back to the right place
                  if it's drag-and-dropped into the menu, not the workspace) 

    2. React-Spring is the library used to create animations for the on hover attribute in the 
      menu bar for functions. 

    3. The dragBoundFunc attribute on the group helps keep the function node within the 
      boundaries of the workspace. 
  

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, {useContext, useEffect, useState} from "react";
import { Group, Circle, Text, Rect} from "react-konva";
import Konva from "konva";
import gui from "../globals/mistgui-globals";
import { Spring, animated } from "react-spring/renderprops-konva";
import { globalContext } from "../globals/global-context.js";
import { fontContext} from '../globals/globals-fonts';
import { Menu2 } from "../menu/Menu2.js";
import globals from "../globals/globals";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

// +----------------------------------------+------------------------
// | Entire Function Group                  |
// +----------------------------------------+

function FuncGroup(props) {
  const global = useContext(globalContext);
  const funName = props.funName;
  const description = "Testing Description"
  const fonts = useContext(fontContext);
  const [isHovered, setIsHovered] = useState(false);
  const rep = props.rep;
  
  // const tips = props.descript + "\n" + props.usage;
  useEffect(() => {
    //console.log("props:"+props);
  }, [props])

  return (
    <Group
      name={funName}
      description={description}
      key={props.index}
      x={props.x*1.15+15}
      y={props.y}
      draggable
      shadowBlur={5}
      onDragStart={(e) => {
        e.target.setAttrs({
          duration: 0.5,
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
        if (e.currentTarget.y() > global.menuHeight) {
          //setTimeout(function () {
          props.addNode("fun", funName, e.target._lastPos.x, e.target._lastPos.y);
          props.changeKey();
          //}, 200);
        } else {
          props.changeKey();
        }
      }}
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > global.width - global.functionWidth) {
          pos.x = global.width - global.functionWidth;
        }
        if (pos.y < 0) {
          pos.y = 0;
        }
        if (
          pos.y >
          global.height - global.funBarHeight - global.functionWidth
        ) {
          pos.y = global.height - global.funBarHeight - global.functionWidth;
        }
        return pos;
      }}
      onMouseOver={function (props) {
        //if (props.tabs.functionsOpen) {
        setIsHovered(true);
      }}
    //}
      onMouseLeave={function (props) {
        setIsHovered(false);
      }}
      
    >
      <Circle
        x={global.functionWidth}
        y={global.functionWidth/2}
        opacity={funName==="rgb" ? 0:1}
        Radius={props.tabs.functionsOpen ? global.valueWidth/10 : 0} // if functions is not open, circles have radius of 0, therefore hiding them
        fill={"#B3B3B3"}
      />
      <Group>
        <Circle
          x={0}
          y={global.functionWidth/5}
          // opacity={props.tabs.functionsOpen? 1:0}
          Radius={props.tabs.functionsOpen ? global.valueWidth/12 : 0} // if functions is not open, circles have radius of 0, therefore hiding them
          fill={ funName === "rgb"? "red" : "#B3B3B3"}
        />
        <Circle
          x={0}
          y={global.functionWidth*2/5}
          opacity={ 
              funName==="square" ||
              funName==="negate" ||
              funName==="sine" ||
              funName==="cosine" ||
              funName==="absolute" ||
              funName==="sign"
              ?
                0 : 1 
          }
          Radius={props.tabs.functionsOpen ? global.valueWidth/12 : 0} // if functions is not open, circles have radius of 0, therefore hiding them
          fill={ funName === "rgb"? "green" : "#B3B3B3"}
        />
        <Circle
          x={0}
          y={global.functionWidth*3/5}
          opacity={ 
              funName==="mistif" || funName==="rgb" 
                ? 1 : 
                funName === "add" ||
                funName === "multiply" ||
                funName === "average" ||
                funName === "wrapsum" ?
                .5 : 0 
          }
          Radius={props.tabs.functionsOpen ? global.valueWidth/12 : 0} // if functions is not open, circles have radius of 0, therefore hiding them
          fill={ funName === "rgb"? "blue" : "#B3B3B3"}
        />
      </Group>
      <Spring
        native
        from={{
          x: props.tabs.valuesOpen ? global.width :
            props.tabs.functionsOpen ? 0 :
            /* props.tabs.customOpen ? - global.width :
            props.tabs.savedOpen ? - 2 * global.width :
            - 3 * global.width, */
            - global.width,
          fontSize: gui.nodeFontSize }}
        to={{
          x: props.tabs.valuesOpen ? global.width :
            props.tabs.functionsOpen ? 0 :
            /* props.tabs.customOpen ? - global.width :
            props.tabs.savedOpen ? - 2 * global.width :
            - 3 * global.width, */
            - global.width,
        }}
      >
        {(props) => (
          <animated.Rect
            {...props}
            y={0}
            width={global.functionWidth}
            height={global.functionWidth}
            fill={gui.functions[funName].color}
            cornerRadius={10}
          />
        )}
      </Spring>
      <Spring
        native
        from={{
          x: props.tabs.valuesOpen ? global.width :
            props.tabs.functionsOpen ? 0 :
            /* props.tabs.customOpen ? - global.width :
            props.tabs.savedOpen ? - 2 * global.width :
            - 3 * global.width, */
            - global.width,
          fontSize: gui.nodeFontSize }}
        to={{
          x: props.tabs.valuesOpen ? global.width :
            props.tabs.functionsOpen ? 0 :
            /* props.tabs.customOpen ? - global.width :
            props.tabs.savedOpen ? - 2 * global.width :
            - 3 * global.width, */
            - global.width,
        }}
      >
        {(props) => (
          <animated.Text
            {...props}
            text={rep == "Words" ? gui.functions[funName].wordRep : gui.functions[funName].symbolRep}
            fontFamily={gui.globalFont}
            fontSize={rep == "Words" ? fonts.functionFontSize : fonts.functionFontSize *.89}
            fill={"white"}
            y={0}
            width={global.functionWidth}
            height={global.functionWidth}
            align={"center"}
            verticalAlign={"middle"}
          />
          // <animated.Text 
          // />
        )}
      </Spring>
    {isHovered? 
      <Group>
        <Rect
          // {...props}
          y={global.functionWidth}
          width={global.functionWidth * 4}
          height={global.functionWidth*3/2}
          fill={"gray"}
          opacity={isHovered? 0.75 : 0}
          cornerRadius={[0, 20, 20, 20]}
        />
        <Text
          text={(gui.functions[funName].descript + "\n\n" + gui.functions[funName].usage)}
          fill={"white"}
          fontSize={(fonts.functionFontSize * 2 / 3)}
          padding={7}
          y={global.functionWidth}
          width={global.functionWidth * 4}
          height={global.functionWidth*3/2}
          align={"center"}
          verticalAlign={"middle"}
          opacity={isHovered? 0.85 : 0}
        />
      </Group>
      : <Group/>
      }
    </Group>
  );
  // +----------------------------------------+
  // | Entire Function Group                  |
  // +----------------------------------------+----------------------
};

export default FuncGroup