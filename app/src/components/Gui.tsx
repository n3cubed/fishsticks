import styles from "./Gui.module.css"
// import useScript from '../hooks/useScript.js';
import { useRef, useEffect, useState } from "react";
import { init, listener } from '../creator.js';
import Controls from './Controls/Controls'

import { createContext } from 'react';


// export const listenerContext = createContext(listener);
let isMounted = false;

export default function Gui() {
    const gui = useRef(null);

    useEffect(() => {
        if (!isMounted) {
            init(gui.current)
                .then((objects) => {
                    if (gui.current) {
                    // if (gui.current) {
                        gui.current.appendChild(objects.view);
                        listener.addDragAction(objects.view, (position)=> { console.log(position) })
                    }
                })
                .catch((err) => {
                    console.error("Failed to initialize GUI:", err);
                });

            isMounted = true;
        }
    }, []);

    return (
        <div ref={gui} className={styles.gui}>
            <Controls />
        </div>
    );

}