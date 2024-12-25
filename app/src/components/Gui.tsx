import styles from "./Gui.module.css"
// import useScript from '../hooks/useScript.js';
import { useRef, useEffect, useState } from "react";
import { init } from '../creator.js';
import Controls from './Controls/Controls'
import { createPortal } from 'react-dom';
import Hotbar from './Hotbar/Hotbar';
import Sidebar from './Sidebar/Sidebar';

const gui = document.createElement("div");
gui.className = styles.gui;
init(gui);

export default function Gui() {
    let guiContainer = useRef(null);

    useEffect(() => {
        guiContainer.current.appendChild(gui);
    }, []);

    return (
        <div ref={guiContainer}>
            {createPortal(<Controls />, gui)}
            {createPortal(<Hotbar />, gui)}
            {createPortal(<Sidebar />, gui)}
        </div>
    );
}