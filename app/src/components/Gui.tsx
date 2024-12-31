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
gui.className = styles.gui;
init(gui);

export default function Gui() {
  let guiContainer = useRef(null);
  let object = useRef(null);
  let selectedObjects = useRef([]);
  let border = useRef(null);

  function checker({clientPosition}) {
    object.current = OI.getObjectFromGlobalPos(clientPosition);
    return !!object.current;
  }

  function grab() {
    if (!selectedObjects.current.includes(object.current)) {
      selectedObjects.current.push(object.current);
      object.current.select();
    }
  }

  function drag({deltaClientPosition}) {
    selectedObjects.current.forEach((object)=> {
      let positionM = OI.px2m(deltaClientPosition);
      let pos = {
        x: object.getPosition().x + positionM.x,
        y: object.getPosition().y + positionM.y,
      };
      object.setPosition(pos);
    })
  }

  function drop() {
    objects.updateColliders();
  }

  function resizeChecker({clientPosition}) {
    for (let i = 0; i < selectedObjects.current.length; i++) {
      let pos = OI.global2m(clientPosition);
      let borderPoint = selectedObjects.current[i].getBorderPoint(pos);
      if (borderPoint) {
        border.current = borderPoint
        return true
      }
    }
    return false
  }

  function resizeGrab() {

  }

  function resizeDrag({deltaClientPosition}) {
    selectedObjects.current.forEach((object)=>{
      object.scale(border.current, OI.px2m(deltaClientPosition))
    })
    objects.updateColliders();
  }

  function resizeDrop() {
    border.current = null
  }

  const [attributesMenu, setAttributesMenu] = useState(null);

  useEffect(() => {
    listener.addDragAction(objects.view, checker, grab, drag, drop);
    listener.addDragAction(objects.view, resizeChecker, resizeGrab, resizeDrag, resizeDrop);
    guiContainer.current.appendChild(gui);

    listener.addRmbAction(
      objects.view,
      ({clientPosition}) => {
        let object = OI.getObjectFromGlobalPos(clientPosition);
        if (object) {
          setAttributesMenu(<AttributesMenu position={clientPosition} object={object} />)
        }
      }
    );

    listener.addLmbAction(
      objects.view,
      ()=>true,
      ()=>{
        setAttributesMenu(null);
        if (object.current) {
          if (!selectedObjects.current.includes(object.current)) {
            selectedObjects.current.push(object.current);
            object.current.select();
          }
        } else if (!border.current) {
          selectedObjects.current.forEach((object)=>object.deselect());
          selectedObjects.current = [];
        }

      }
    );
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
