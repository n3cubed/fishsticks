import { zoom, pan } from './panZoom.js';
import * as PIXI from 'pixi.js';

const s = 100;

function m2pos(pos) {
    let x = pos.x * s;
    let y = -pos.y * s;
    return {x, y};
}

class Canvas {
    constructor(props) {
        const { backgroundColor = 0x1099bb } = props;
        this.backgroundColor = backgroundColor;
        const app = new PIXI.Application();
        this.app = app;
        this.view = document.createElement('canvas');
    }

    async init() {
        await this.app.init({
            background: '#1099bb',
            resizeTo: window,
            antialias: true,
            view: this.view,
        })
        this.app.canvas.id = 'pixi-canvas';
        this.app.renderer.background.color = this.backgroundColor;

        const canvas = new PIXI.Container();
        canvas.sortableChildren = true;
        canvas.width = 100; //
        canvas.height = 100;
        canvas.pivot.set(canvas.width / 2, canvas.height / 2);
        canvas.position.set(this.app.screen.width / 2, this.app.screen.height / 1.3);

        const lineWidth = 1;

        const app = this.app;

        const grid = new PIXI.Graphics();

        updateGrid();
        // canvas.addChild(grid);
        this.app.stage.addChild(grid);
        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        // NOTE: very messy but it works, will clean up later
        function updateGrid() {
            grid.clear()

            // console.log(mod(numHalves,1))
            let numHalves = -Math.log2(canvas.scale.x);
            let spacingMultiplier = canvas.scale.x/Math.pow(2,Math.floor(-numHalves));
            let lineSpacing = 1 * s / 5 * spacingMultiplier;
            // let lineSpacing = 100/5 * canvas.scale.x * (mod(numHalves,1));
            // const spacingMultiplier = 1;

            let numHorizontalLines = app.screen.height / lineSpacing + 1;
            let initialY = mod(canvas.y,lineSpacing);
            let initialLineNumY = Math.floor(canvas.y / lineSpacing);


            let numVerticalLines = app.screen.width / lineSpacing + 1;
            // console.log(numVerticalLines)
            let initialX = mod(canvas.x,lineSpacing);
            let initialLineNumX = Math.floor(canvas.x / lineSpacing);

            let numbersX = grid.getChildrenByLabel('x');
            let numbersY = grid.getChildrenByLabel('y');
            let number0 = grid.getChildrenByLabel('0');

            let lenX = Math.floor(numVerticalLines/5) - (canvas.x < app.screen.width);
            let lenY = Math.floor(numHorizontalLines/5) - (canvas.y < app.screen.height);

            grid.removeChild(...numbersX.splice(lenX))
            grid.removeChild(...numbersY.splice(lenY))
            numbersX = numbersX.splice(0, lenX);
            numbersY = numbersY.splice(0, lenY);

            const textStyle = new PIXI.TextStyle({ stroke: "ghostwhite", strokeThickness: 6, fontSize: 14 })

            for (let i = 0; i < Math.max(numVerticalLines, numHorizontalLines) ; i++) {
                let lineNumX = initialLineNumX - i;
                let lineOffsetX = mod(lineNumX,5);
                let x = initialX + i * lineSpacing;

                let lineNumY = initialLineNumY - i;
                let lineOffsetY = mod(lineNumY,5);
                let y = initialY + i * lineSpacing;

                if (lineOffsetX != 0 && lineNumX != 0 && i < numVerticalLines) {
                    grid.moveTo(x, -app.screen.height/2-lineSpacing);
                    grid.lineTo(x, app.screen.height + lineSpacing);
                    grid.stroke({ width: lineWidth, color: 'lightgrey' });
                }
                if (lineOffsetY != 0 && lineNumY != 0 && i < numHorizontalLines) {
                    grid.moveTo(-(app.screen.width)/2-lineSpacing, y);
                    grid.lineTo(app.screen.width + lineSpacing, y);
                    grid.stroke({ width: lineWidth, color: 'lightgrey' });
                }
            }

            for (let i = 0; i < Math.max(numVerticalLines, numHorizontalLines); i ++) {
                let lineNumX = initialLineNumX - i;
                let lineOffsetX = mod(lineNumX,5);
                let x = initialX + i * lineSpacing;

                let lineNumY = initialLineNumY - i;
                let lineOffsetY = mod(lineNumY,5);
                let y = initialY + i * lineSpacing;

                if (lineNumX == 0) {
                    let number = grid.getChildByLabel('0');
                    if (number) {
                        number.y = canvas.y;
                        number.x = canvas.x-number.width-5;
                    } else {
                        const number = new PIXI.Text({ text: '0', style: textStyle });
                        number.y = canvas.y;
                        number.x = canvas.x-number.width-5;
                        number.label = '0';
                        grid.addChild(number);
                    }
                }
                if (lineOffsetX == 0 && lineNumX != 0 && i < numVerticalLines) {
                    // numbers.forEach((number, j) => {
                    //     console.log(i)
                    //     console.log(Math.floor(i/5),j)
                    //     number.visible = Math.floor(i/5) == j;
                    // })
                    let number = numbersX[Math.floor((i)/5) - (canvas.x < app.screen.width && lineNumX < 0)];
                    // initialLineNumX = left most line num
                    // numbersX
                    // i = current line starting from left and 0
                    // lineOffsetX = lineNumX % 5 = (0, 4)
                    // lineNumX = current line num = initialLineNumX - i ()
                    // numVerticalLines (1, n)

                    let num = -(lineNumX/5 * Math.pow(2,Math.ceil(numHalves)));

                    if (number) {
                        number.text = num;
                        number.y = Math.min(Math.max(canvas.y, 0), app.screen.height - number.height);
                        number.x = x - number.width/2;
                    } else {
                        const number = new PIXI.Text({ text: num, style: textStyle });
                        number.y = Math.min(Math.max(canvas.y, 0), app.screen.height - number.height);
                        number.x = x - number.width/2;
                        number.label = 'x';
                        grid.addChild(number);
                    }
                    // console.log(initialX); // -4.5
                    // console.log(i); // 4
                    // console.log(initialLineNumX);
                    // console.log(lineNumX); // -5
                    // console.log(x);
                    grid.moveTo(x, -app.screen.height/2-lineSpacing);
                    grid.lineTo(x, app.screen.height + lineSpacing);
                    grid.stroke({ width: lineWidth, color: 'grey' });
                }
                if (lineOffsetY == 0 && lineNumY != 0 && i < numHorizontalLines) {
                    let index = Math.floor(i/5) - (canvas.y < app.screen.height && lineNumY < 0);
                    let numb = numbersY[index];

                    let num = lineNumY/5 * Math.pow(2,Math.ceil(numHalves));
                    if (numb) {
                        numb.text = num;
                        numb.x = Math.min(Math.max(canvas.x - numb.width - 5, 0), app.screen.width - numb.width);
                        numb.y = y - numb.height/2;
                    } else {
                        const number = new PIXI.Text({ text: num, style: textStyle });
                        number.x = Math.min(Math.max(canvas.x - number.width - 5, 0), app.screen.width - number.width);
                        number.y = y - number.height/2;
                        number.label = 'y'
                        grid.addChild(number);
                    }

                    grid.moveTo(-(app.screen.width)/2-lineSpacing, y);
                    grid.lineTo(app.screen.width + lineSpacing, y);
                    grid.stroke({ width: lineWidth, color: 'grey' });
                }
            }

            if (canvas.x < app.screen.width) {
                let x = canvas.x;
                grid.moveTo(x, -app.screen.height/2);
                grid.lineTo(x,  app.screen.height);
                grid.stroke({ width: lineWidth, color: 'black' });
            }

            if (canvas.y < app.screen.height) {
                let y = canvas.y;
                grid.moveTo(-(app.screen.width)/2, y);
                grid.lineTo(app.screen.width, y);
                grid.stroke({ width: lineWidth, color: 'black' });
            }
        }

        // const center = new PIXI.Graphics();
        // center.circle(0,0,5).fill(0x000000);
        // canvas.addChild(center);

        zoom(this.app, canvas, 0.05, updateGrid);
        pan(this.app, canvas, updateGrid);

        this.app.stage.addChild(canvas);

        this.pixiCanvas = canvas;
    }

    addTicker(tickerFunc) {
        this.app.ticker.add(tickerFunc);
    }

    removeTicker(tickerFunc) {
        this.app.ticker.remove(tickerFunc);
    }

    start() { // unused
        this.app.ticker.start()
    }

    stop() { // unused
        this.app.ticker.stop()
    }

    global2pos(x, y) {
        return this.pixiCanvas.toLocal({x, y});
    }

    put(obj) {
        this.pixiCanvas.addChild(obj);
    }

    remove(obj) {
        this.pixiCanvas.removeChild(obj);
    }

    drawPoint(pos, color = 0x000000) {
        const point = new PIXI.Graphics();
        point.beginFill(color);
        point.drawCircle(0, 0, 5);
        point.endFill();
        point.position = m2pos(pos);
        this.put(point);
        return point;
    }

    removePoint(point) {
        this.remove(point);
    }
}

class ObjectGraphics {
    constructor(canvas, props) {

        this.canvas = canvas;
        const {
            pos = { x: 0, y: 0 },
            color = 0xffffff,
            v = { x: 0, y: 0 },
            a = { x: 0, y: 0 }
        } = props;

        this.pos = pos;
        this.color = color;
        this.v = v;
        this.a = a;
        const object = new PIXI.Container();
        object.position = m2pos(this.pos);
        const pixiGraphics = new PIXI.Graphics();
        const border = new PIXI.Container();
        const borderLines = new PIXI.Graphics();
        const borderPoint1 = new PIXI.Graphics();
        const borderPoint2 = new PIXI.Graphics();
        const borderPoint3 = new PIXI.Graphics();
        const borderPoint4 = new PIXI.Graphics();
        const borderPoints = {
            "bottomRight": borderPoint1,
            "topRight": borderPoint2,
            "bottomLeft": borderPoint3,
            "topLeft": borderPoint4
        };
        border.addChild(borderLines);
        border.addChild(...Object.values(borderPoints));
        object.addChild(border);
        object.addChild(pixiGraphics);

        this.borderLines = borderLines
        this.borderPoints = borderPoints
        this.border = border;
        this.object = object;
        this.pixiGraphics = pixiGraphics;
    }

    put() {
        this.canvas.put(this.object);
    }

    remove() {
        this.canvas.remove(this.object);
    }

    getPosition() {
        return this.object.position;
    }

    getRotation() {
        return this.object.rotation
    }

    getColor() {
        return this.pixiGraphics.fillStyle.color;
    }

    setPosition(pos) {
        this.object.position = m2pos(pos);
    }

    setRotation(angle) {
        this.object.rotation = -angle;
    }

    getBorderPoint(posM) {
        const scale = this.canvas.pixiCanvas.scale.x;
        let pos = m2pos(posM);
        for (let point in this.borderPoints) {
            let pointPosLocal = this.borderPoints[point].position
            let pointPos =  {x:pointPosLocal.x + this.object.x , y: pointPosLocal.y + this.object.y };
            console.log(pos, pointPos.x, Math.sqrt(Math.pow(pos.x - pointPos.x, 2) + Math.pow(pos.y - pointPos.y, 2)))
            if (Math.sqrt(Math.pow(pos.x - pointPos.x, 2) + Math.pow(pos.y - pointPos.y, 2)) < 5/scale/2) return point;
        }
        return null;
    }
}

class BallG extends ObjectGraphics {
    constructor(canvas, props) {
        super(canvas, props);
        const { r = 0 } = props;
        this.r = r * s;

        this.draw(this.r, {color: this.color});
    }

    draw(r, style) {
        this.pixiGraphics.clear();
        this.pixiGraphics.circle(0,0, r).fill(style);
    }

    drawBorder() {
        this.borderLines.clear();
        const r = this.getRadius();
        const scale = this.canvas.pixiCanvas.scale.x;
        // let r = 100;
        this.borderLines
            .moveTo(-r, -r - 1/scale)
            .lineTo(-r, r)
            .lineTo(r, r)
            .lineTo(r, -r)
            .lineTo(-r, -r)

        this.borderLines.stroke({alignment: 0, width: 2/scale, color:0xff0000})

        Object.values(this.borderPoints).forEach((graphic, i) => {
            graphic.clear();
            graphic.stroke({alignment: 0, width: 1, color:0xff0000})
            graphic.circle(0, 0, 5/scale).fill({color: 0xff0000});
            graphic.position.x = r * Math.pow(-1,i >> 1);
            graphic.position.y = r * Math.pow(-1,i);
        })
    }

    clearBorder() {
        this.borderLines.clear();
        Object.values(this.borderPoints).forEach((graphic)=>graphic.clear());
    }

    getRadius() {
        let r = this.pixiGraphics.height/2;
        return r ? r : this.r;
    }

    setRadius(r) {
        this.draw(r * s, {color: this.getColor()});
    }

    setColor(color) {
        this.draw(this.getRadius(), {color});
    }

}

class RectG extends ObjectGraphics {
    constructor(canvas, props) {
        super(canvas, props);
        const { w = 0, h = 0 } = props;
        this.w = w * s;
        this.h = h * s;
        this.draw(this.w, this.h, {color: this.color});
    }

    draw(w, h, style) {
        this.pixiGraphics.clear();
        this.pixiGraphics.rect(-w/2, -h/2, w, h).fill(style);
    }

    getWidth() {
        let w = this.pixiGraphics.width
        return w ? w : this.w;
        // return this.pixiGraphics.width
    }

    getHeight() {
        let h = this.pixiGraphics.height
        return h ? h : this.h;
        // return this.pixiGraphics.height
    }

    setWidth(w) {
        this.draw(w, this.getHeight(), {color: this.getColor()});
    }

    setHeight(h) {
        this.draw(this.getWidth(), h, {color: this.getColor()});
    }

    setColor(color) {
        this.draw(this.getWidth(), this.getHeight(), {color});
    }
}


export { Canvas, BallG, RectG };
