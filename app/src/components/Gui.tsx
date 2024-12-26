import styles from "./Gui.module.css";
// import useScript from '../hooks/useScript.js';
import { useRef, useEffect, useState } from "react";
import { init, listener, objects, OI } from "../creator.js";
import Controls from "./Controls/Controls";
import { createPortal } from "react-dom";
import Hotbar from "./Hotbar/Hotbar";
import Sidebar from "./Sidebar/Sidebar";
import AttributesMenu from "./AttributesMenu/AttributesMenu";

const gui = document.createElement("div");
const canvas = document.getElementById("canvas");
gui.className = styles.gui;
init(gui, canvas);

export default function Gui() {
  let guiContainer = useRef(null);
  let [position, setPosition] = useState({ x: 0, y: 0 });
  let initialPosition = useRef({ x: 0, y: 0 });
  let initialOffsetPosition = useRef({ x: 0, y: 0 });

  function grab(clientPosition, offsetPosition) {
    initialPosition.current = clientPosition;
    initialOffsetPosition.current = offsetPosition;
  }

  function drag(position) {
    let dx = position.x - initialPosition.current.x;
    let dy = position.y - initialPosition.current.y;
    setPosition({ x: dx, y: dy });
  }

  function drop(position) {
    let pos = { x: 0.0, y: 0.0 };
    pos.x = position.x - initialOffsetPosition.current.x
    pos.y = position.y - initialOffsetPosition.current.y
    let object = OI.getObjectFromGlobalPos(position)
    object.setPosition2(pos);
    setPosition({ x: 0, y: 0 });
  }

    const [attributesMenu, setAttributesMenu] = useState(null);
    
  useEffect(() => {
    listener.addDragAction(objects.view, grab, drag, drop);
    guiContainer.current.appendChild(gui);

    listener.addRmbAction(
      objects.view,
      (position) => {
        let object = OI.getObjectFromGlobalPos(position);
        // let object = OI.getObjectFromGlobalPos(position);
        if (object) {
          setAttributesMenu(<AttributesMenu position={position} objectProps={object.props} />)
        }
      }
    );

    listener.addLmbAction(objects.view, ()=>{ setAttributesMenu(null); });
  }, []);


  return (
    <div ref={guiContainer}>
      {createPortal([
        <Controls />,
        <Sidebar />,
        <Hotbar />
        ], gui)}
      {attributesMenu && createPortal(attributesMenu, gui)}
    </div>
  );
}
