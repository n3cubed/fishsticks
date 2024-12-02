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
                    gui.current.appendChild(objects.view);
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