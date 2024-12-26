import styles from "./Gui.module.css";
// import useScript from '../hooks/useScript.js';
import { useRef, useEffect, useState } from "react";
import { init } from "../creator.js";
import Controls from "./Controls/Controls";
import { createPortal } from "react-dom";
import Hotbar from "./Hotbar/Hotbar";
import Sidebar from "./Sidebar/Sidebar";
import { listener } from "../creator.js";
import { objects, OI } from "../creator.js";

const gui = document.createElement("div");
gui.className = styles.gui;
init(gui);

export default function Gui() {
  let guiContainer = useRef(null);
  let [position, setPosition] = useState({ x: 0, y: 0 });
  let iconRef = useRef(null);
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
    pos.x = position.x - initialOffsetPosition.current.x + iconRef.current.offsetWidth/2;
    pos.y = position.y - initialOffsetPosition.current.y + iconRef.current.offsetHeight/2;
    let object = OI.getObjectFromGlobalPos(position)
    object.setPosition2(pos);
    setPosition({ x: 0, y: 0 });
  }

  useEffect(() => {
    guiContainer.current.appendChild(gui);
    listener.addDragAction(objects.view, grab, drag, drop);
  }, []);

  return (
    <div ref={guiContainer}>
      {createPortal(<Controls />, gui)}
      {createPortal(<Hotbar />, gui)}
      {createPortal(<Sidebar />, gui)}
    </div>
  );
}
