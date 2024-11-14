import styles from "../styles/gui.css"
import useScript from '../hooks/useScript.js';

// TODO: move gui static files to react to use css modules

function Gui() {
    useScript(`${process.env.PUBLIC_URL}/gui/gui.js`, true);
    useScript(`${process.env.PUBLIC_URL}/gui/cli.js`, true);
    useScript(`${process.env.PUBLIC_URL}/gui/guiControl.js`, true);
    useScript(`${process.env.PUBLIC_URL}/gui/guiEdit.js`, true);

    return(
        <div id="gui">
            <div id="control">
                <button id="start-stop-button" className="control-button">start</button>
                <button id="play-pause-button" className="control-button">play</button>
                <button id="step-button" className="control-button">step</button>
            </div>
            <div id="edit">
                <button id="create-button" className="edit-button">create</button>
                <textarea id="input-line" className="edit-input"></textarea>
            </div>

        </div>
    )
}

export default Gui;