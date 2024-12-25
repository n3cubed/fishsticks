

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

        this.lmbUpActions = [];
        this.rmbUpActions = [];
        this.mmbUpActions = [];
        this.wheelActions = [];
        this.dragActions = [];

        const onPointerUp = (e) => {
            console.log('pointerup')
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
                const matchedActions = this.dragActions.filter(({ element }) => target == element )
                if (matchedActions.length != 0) {
                    let clientPosition = { x: e.clientX, y: e.clientY };
                    let offsetPosition = { x: e.offsetX, y: e.offsetY };
                    matchedActions.forEach(({ grabAction }) => grabAction(clientPosition, offsetPosition));

                    const onPointerMove = (e) => {
                        console.log('pointermove')
                        let position = { x: e.clientX, y: e.clientY };
                        const runAction = ( action ) => action(position);
                        matchedActions.forEach(({ dragAction }) => {runAction(dragAction)});
                    }
                    onPointerMove(e)

                    const onPointerUp = (e) => {
                        let position = { x: e.clientX, y: e.clientY };
                        const runAction = ( action ) => action(position);
                        matchedActions.forEach(({ dropAction }) => runAction(dropAction));
                        source.removeEventListener('pointermove', onPointerMove);
                    }

                    source.addEventListener('pointermove', onPointerMove);
                    source.addEventListener('pointerup', onPointerUp, { once: true });
                }
            }
        }

        source.addEventListener('pointerdown', onPointerDown);
    }

    addDragAction(element, grabAction, dragAction, dropAction) {
        this.dragActions.push({element, grabAction, dragAction, dropAction });
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