// import Logger from "./guiLogger.js"
// import { initializeWasm } from "../../public/uiFunctions.js";

// import {ObjectsInterface, Objects, Tools} from 'api';
import { Objects, Listener } from 'api';
// const gui = document.getElementById("gui");

// let Objects = await import("../../../api/src/objects.js/index.js");


const simulationProps = {
    timeStep: 1.0 / 500.0,
    // gravity: { x: 0, y: -9.8100000 },
    gravity: { x: 0, y: 0 },
}

const canvasProps = {
    // backgroundColor: "cadetblue",
    // backgroundColor: "gainsboro",
    // backgroundColor: "teal",
    // backgroundColor: "thistle",
    // backgroundColor: "steelblue",
    backgroundColor: "ghostwhite",
}

export let objects;
export let listener;

export async function init(source) {
    listener = new Listener(source);

    objects = new Objects(simulationProps, canvasProps);

    await objects.init();

    return objects;
}


// const OIProps = { s: 100 }
// const OI = new ObjectsInterface(objects, OIProps)

// const T = new Tools(objects);

// const L = new Logger();

// export { OI, T, L }
