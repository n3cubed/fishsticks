
function getProps(e) {
    let clientPosition = { x: e.clientX, y: e.clientY };
    let offsetPosition = { x: e.offsetX, y: e.offsetY };
    let deltaClientPosition;
    return {clientPosition, offsetPosition, deltaClientPosition}


}
export default class Listener {
    constructor(source) {
        this.history = {
            "actions": []
        }

        this.source = source;

        // pointerover - hover over
        // pointerenter - hover over
        // pointerdown - active
        // pointermove - moves
        // pointerup - not active
        // pointercancel - pointer disabled
        // pointerout - not over
        // pointerleave - not over
        // pointerrawupdate - other
        // gotpointercapture
        // lostpointercapture

        this.lmbActions = [];
        this.rmbActions = [];
        this.mmbActions = [];
        this.wheelActions = [];
        this.dragActions = [];

        const onPointerDown = (e) => {
            let button = e.button;
            const props = getProps(e);
            let target = e.target;

            let matchedLmbActions, matchedDragActions, matchedMmbActions, matchedRmbActions;

            console.log('pointerdown');
            if (button === 0) { // LMB or touch
                matchedLmbActions = this.lmbActions.filter(({ element, checker }) => target == element && checker(props));
                matchedDragActions = this.dragActions.filter(({ element, checker }) => target == element && checker(props));
                if (matchedLmbActions.length != 0) {
                    const onPointerUp = (e) => {
                        if (e.button === button && e.target === target) {
                            console.log('lmb')
                            matchedLmbActions.forEach(({ action }) => action(props));
                        }
                    }
                    source.addEventListener('pointerup', onPointerUp, { once: true });
                }

                if (matchedDragActions.length != 0) {
                    matchedDragActions.forEach(({ grabAction }) => grabAction(props));
                    let previousClientPosition =  props.clientPosition;

                    const onPointerMove = (e) => {
                        const props = getProps(e)
                        let deltaClientPosition = { x: props.clientPosition.x - previousClientPosition.x, y: props.clientPosition.y - previousClientPosition.y  }
                        previousClientPosition =  props.clientPosition;
                        // console.log(deltaClientPosition);
                        props.deltaClientPosition = deltaClientPosition;
                        matchedDragActions.forEach(({ dragAction }) => dragAction(props));
                    }
                    onPointerMove(e)

                    const onPointerUp = (e) => {
                        const props = getProps(e)
                        matchedDragActions.forEach(({ dropAction }) => dropAction(props));
                        source.removeEventListener('pointermove', onPointerMove);
                    }

                    source.addEventListener('pointermove', onPointerMove);
                    source.addEventListener('pointerup', onPointerUp, { once: true });
                }
            } else if (button === 2) { // RMB or //TODO: touch hold
                matchedRmbActions = this.rmbActions.filter(({ element, checker }) => target == element && checker(props));
                if (matchedRmbActions.length != 0) {
                    const onPointerUp = (e) => {
                        if (e.button === button && e.target === target) {
                            console.log('rmb')
                            matchedRmbActions.forEach(({ action }) => action(props));
                        }
                    }
                    source.addEventListener('pointerup', onPointerUp, { once: true });
                }
            } else if (button === 1) { // MMB - currently unused
                matchedMmbActions = this.mmbActions.filter(({ element, checker }) => target == element && checker(props));
                if (matchedMmbActions.length != 0) {
                    const onPointerUp = (e) => {
                        if (e.button === button && e.target === target) {
                            console.log('mmb')
                            matchedMmbActions.forEach(({ action }) => action(props));
                        }
                    }
                    source.addEventListener('pointerup', onPointerUp, { once: true });
                }
            }
        }
        source.addEventListener('pointerdown', onPointerDown);
    }

    addDragAction(element, checker, grabAction, dragAction, dropAction) {
        this.dragActions.push({element, checker, grabAction, dragAction, dropAction });
    }
    addLmbAction(element, checker, action) {
        this.lmbActions.push({element, checker, action});
    }
    addRmbAction(element, checker, action) {
        this.rmbActions.push({element, checker, action});
    }
    addWheelAction(element, checker, action) {
        this.wheelActions.push({element, checker, action});
    }
}

// add deltaClientPosition
// fix other listeners