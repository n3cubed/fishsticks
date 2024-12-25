import styles from "./Hotbar.module.css";
import { useEffect, useRef, useState, createElement } from "react";
import { listener } from "../../creator.js";

type props = {
  iconType: string;
  iconProps: { [key: string]: any };
  objectProps: { [key: string]: any };
  action: Function;
};

export default function Item({ iconType, iconProps, objectProps, action }: props) {
  let initialPosition = useRef({ x: 0, y: 0 });
  let initialOffsetPosition = useRef({ x: 0, y: 0 });
  let [position, setPosition] = useState({ x: 0, y: 0 });
  let style = { left: position.x, top: position.y };
  let iconPropsNew = { ...iconProps, style };

  let iconRef = useRef(null);
  let icon = createElement(iconType, { ref: iconRef, ...iconPropsNew });

  function grab(clientPosition, offsetPosition) {
    iconRef.current.style.cursor = "grabbing";
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
    action(pos);
    setPosition({ x: 0, y: 0 });
    iconRef.current.style.cursor = "default";
  }

  useEffect(() => {
    const icon = iconRef.current;
    if (icon) {
      listener.addDragAction(icon, grab, drag, drop);
    }
  }, []);

  return icon;
}
