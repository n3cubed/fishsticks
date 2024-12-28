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
  let initialPosition = useRef({ x: 0, y: 0 });
  let initialOffsetPosition = useRef({ x: 0, y: 0 });
  let object = useRef(null);

  function grab(clientPosition) {
    object.current = OI.getObjectFromGlobalPos(clientPosition);
    if (!object.current) return;
    let clientPositionM = OI.global2m(clientPosition);
    initialPosition.current = clientPositionM;
    let objPos = OI.pos2m(object.current.graphicsObj.object.position);
    initialOffsetPosition.current = { x: objPos.x - clientPositionM.x, y: objPos.y - clientPositionM.y };
  }

  function drag(position) {
    if (object.current) {
      let positionM = OI.global2m(position);
      let pos = { x: 0, y: 0};
      pos.x = positionM.x + initialOffsetPosition.current.x;
      pos.y = positionM.y + initialOffsetPosition.current.y;
      object.current.setPosition(pos);
    }
  }

  function drop(position) {
    if (object.current) {
      let positionM = OI.global2m(position);
      let pos = { x: 0, y: 0};
      pos.x = positionM.x + initialOffsetPosition.current.x;
      pos.y = positionM.y + initialOffsetPosition.current.y;
      object.current.setPosition(pos);
      objects.updateColliders();
    }
  }

  const [attributesMenu, setAttributesMenu] = useState(null);

  useEffect(() => {
    listener.addDragAction(objects.view, grab, drag, drop);
    guiContainer.current.appendChild(gui);

    listener.addRmbAction(
      objects.view,
      (position) => {
        let object = OI.getObjectFromGlobalPos(position);
        if (object) {
          setAttributesMenu(<AttributesMenu position={position} object={object} />)
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
