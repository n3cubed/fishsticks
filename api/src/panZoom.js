
export function zoom(app, canvas, scale, callback) {
    let cursor;
    app.canvas.onwheel = function (e) {
        e.preventDefault();
        clearTimeout(cursor);
        let factor = 1;
        if (e.deltaY < 0) {
            factor += scale;
            this.style.cursor = "zoom-in";
        } else {
            factor -= scale;
            this.style.cursor = "zoom-out";
        }
        cursor = setTimeout(() => {
            this.style.cursor = "default";
        }, 300);
        canvas.scale.x *= factor;
        canvas.scale.y *= factor;
        canvas.x += (e.clientX - canvas.x) * (1 - factor);
        canvas.y += (e.clientY - canvas.y) * (1 - factor);
        app.renderer.render(app.stage);
        callback();
    }
}


export function ewResize(ele, scale, onResize) {
    ele.addEventListener("mousedown", function (e) {
        if (e && (e.which === 1 || e.button === 0)) {
            document.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; }, { "once": true });
            let lastX = e.clientX;
            let factor = 1;
            let currentX = e.clientX;

            let resizeInterval = setInterval(() => {
                factor = 1 + (currentX - lastX) * scale;
                onResize(e, factor);
                lastX = currentX;
            }, 50);
            function onMouseMove(e) {
                if (lastX) {
                    currentX = e.clientX;
                }
            }
            ele.addEventListener("mousemove", onMouseMove);

            window.addEventListener("mouseup", function () {
                clearInterval(resizeInterval);
                ele.style.cursor = "default";
                ele.removeEventListener("mousemove", onMouseMove);
            }, { "once": true });
        }
    });
}


export function pan(app, canvas, callback) {
    app.canvas.addEventListener("mousedown", function (e) {
        if (e && (e.which === 3 || e.button === 2)) {
            app.view.style.cursor = "grabbing";
            document.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; }, { "once": true });
            let lastX = e.offsetX;
            let lastY = e.offsetY;

            function onMouseMove(e) {
                if (lastX && lastY) {
                    const deltaX = (e.offsetX - lastX);
                    const deltaY = (e.offsetY - lastY);
                    canvas.x += deltaX;
                    canvas.y += deltaY;
                    lastX = e.offsetX;
                    lastY = e.offsetY;
                    app.renderer.render(app.stage);
                    callback();
                }
            }

            app.canvas.addEventListener("mousemove", onMouseMove);

            window.addEventListener("mouseup", function () {
                app.canvas.style.cursor = "default";
                app.canvas.removeEventListener("mousemove", onMouseMove);
            }, { "once": true });
        }
    });
}