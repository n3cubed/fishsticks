

export default class Listener {
    constructor(source) {
        console.log("creation")
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

        this.lmbUpActions = [];
        this.rmbUpActions = [];
        this.mmbUpActions = [];
        this.wheelActions = [];
        this.dragActions = [];

        let onPointerMove;

        const onPointerUp = (e) => {
            console.log('pointerup')
            if (onPointerMove) source.removeEventListener('pointermove', onPointerMove);

            let target = e.target;
            let position = { x: e.clientX, y: e.clientY };

            const runAction = ({ element, action }) => {
                if (target == element) action(position);
            }

            if (e.button === 0) { // LMB or touch
                console.log('lmb')
                this.lmbUpActions.forEach((action) => runAction(action));
            } else if (e.button === 2) { // RMB or //TODO: touch hold
                console.log('rmb')
                this.rmbUpActions.forEach((action) => runAction(action));
            } else if (e.button === 1) { // MMB - currently unused
                console.log('mmb')
                this.mmbUpActions.forEach((action) => runAction(action));
            }
        }

        source.addEventListener('pointerup', onPointerUp);

        const onPointerDown = (e) => {
            console.log('pointerdown')
            let target = e.target;

            if (e.button === 0) { // LMB or touch
                const matchedActions = this.dragActions.filter(({ element, action }) => target == element )
                console.log("lmb")
                if (matchedActions.length != 0) {
                    onPointerMove = (e) => {
                        console.log('pointermove')
                        let position = { x: e.clientX, y: e.clientY };
                        const runAction = ({ element, action }) => action(position);
                        matchedActions.forEach((action) => runAction(action));
                    }
                    onPointerMove(e)

                    source.addEventListener('pointermove', onPointerMove);
                } else {
                    onPointerMove = null;
                }
            }
        }

        source.addEventListener('pointerdown', onPointerDown);
    }

    addDragAction(element, action) {
        this.dragActions.push({element, action});
    }
    addLmbAction(element, action) {
        this.lmbUpActions.push({element, action});
    }
    addRmbAction(element, action) {
        this.rmbUpActions.push({element, action});
    }
    addWheelAction(element, action) {
        this.wheelActions.push({element, action});
    }
}