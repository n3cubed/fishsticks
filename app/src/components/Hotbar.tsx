import styles from "./Hotbar.module.css"; 
import { useRef, useEffect } from "react";
import { objects, ObjectsInterface } from "api";

const simplePropsB = {
  pos: { x: 0.0, y: 0.0 },
  r: 0.25,
  color: 0xffffff,
  mass: 1.0,
  restitution: 1.0,
  rigidBody: "dynamic",
  canSleep: false,
  ccd: true,
  v: { x: 1.0, y: 0.0 },
};

const simplePropsR = {
  pos: { x: 0.0, y: 0.0 },
  w: 0.5,
  h: 0.5,
  color: 0xffffff,
  mass: 1.0,
  restitution: 1.0,
  rigidBody: "dynamic",
  canSleep: false,
  ccd: true,
  v: { x: 0.0, y: 0.0 },
};

function drag(element, callback) {
  element.addEventListener("mousedown", function (e) {
    if (e && (e.which === 3 || e.button === 0)) {
      element.style.cursor = "grabbing";
      document.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; }, { "once": true });
      let lastX = e.clientX;
      let lastY = e.clientY;
      let eleX = e.offsetX;
      let eleY = e.offsetY;
      
      const onMouseMove = (e) => {
        if (lastX && lastY) {
            element.style.left = `${e.clientX - lastX}px`;
            element.style.top = `${e.clientY - lastY}px`;
        }
      }

      window.addEventListener("mousemove", onMouseMove);

      window.addEventListener("mouseup", function (e) {
        let pos = { x: 0.0, y: 0.0 };  
        pos.x = e.clientX - eleX + element.offsetWidth/2;
        pos.y = e.clientY - eleY + element.offsetHeight/2;
        console.log(element.clientLeft + element.offsetWidth/2);
        callback(pos)
        element.style.left = `0px`;
        element.style.top = `0px`;
        element.style.cursor = "default";
        window.removeEventListener("mousemove", onMouseMove);
      }, { "once": true });
    }
  });
}

export default function Hotbar() {
  const circle = useRef(null);
  const square = useRef(null);
  const polygon = useRef(null);
  
  useEffect(() => {
    
    drag(circle.current, (pos) => { simplePropsB.pos = pos; new ObjectsInterface(objects, {}).createBallFromGlobalPos(simplePropsB).put(); });
    drag(square.current , (pos) => { simplePropsR.pos = pos; new ObjectsInterface(objects, {}).createBallFromGlobalPos(simplePropsR).put(); });
    drag(polygon.current , (pos) => { simplePropsB.pos = pos; new ObjectsInterface(objects, {}).createBallFromGlobalPos(simplePropsB).put(); });
  }, []);
  return (
    <>
      <div className={`${styles.hotbar}`}>
        <div ref={circle}  className={`${styles.circle}`}></div>
        <div ref={square} className={`${styles.square}`}></div>
        <div ref={polygon} className={`${styles.polygon}`}></div>
      </div>
      
    </>
  )
}


