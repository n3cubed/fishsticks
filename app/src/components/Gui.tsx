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
  // let [attributesMenuPosition, setAttributesMenuPosition] = useState({x: 0, y: 0});
  // let [showAttributesMenu, setShowAttributesMenu] = useState(false);
  // let attributesMenu = useRef(null);
  const [attributesMenu, setAttributesMenu] = useState(null);

  useEffect(() => {
    guiContainer.current.appendChild(gui);

    listener.addRmbAction(
      objects.view,
      (position) => {
        let object = OI.getObjectFromGlobalPos(position);
        // let object = OI.getObjectFromGlobalPos(position);
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
