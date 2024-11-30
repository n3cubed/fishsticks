import styles from "./Gui.module.css"
import useScript from '../hooks/useScript.js';
import { useRef, useEffect, useState } from "react";
import { init } from 'api';
import Controls from './Controls/Controls'

export default function Gui() {
    const gui = useRef(null);

    useEffect(() => {
        let isMounted = true;

        init()
            .then((objects) => {
                if (isMounted && gui.current) {
                    console.log(typeof objects.view); // Should log "object"
                    console.log(objects.view); // The HTMLElement
                    gui.current.appendChild(objects.view); // Append it to the ref container
                }
            })
            .catch((err) => {
                console.error("Failed to initialize GUI:", err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div ref={gui} className={styles.gui}>
            <Controls />
        </div>
    );

}