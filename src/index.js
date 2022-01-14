import p5 from 'p5';
import P5 from 'p5';
import {PRNGRand} from "./random";
import {ColorScheme} from "./color";
import {createScene, drawScene} from "./scene";


let chunks = []
var recorder;
const pixelDens = 1;
const sketch = p5 => {

    let colorScheme;
    let colorsArrayMap = new Map()
    let acceleration = 0;
    let velocity = 0
    let globalLineWidth = 30;

    let radius = 0.5;
    let colorFlipAllowed = false;

    const frate = 30 // frame rate
    const numFrames = 100 // num of frames to record
    let recording = false
    let scene;

    let gridSize=250;
    let px = Math.floor(gridSize/2), py = Math.floor(gridSize/2);
    let keysDown = {}

    p5.setup = () => {
        const canv = p5.createCanvas(800, 80);
        canv.parent('sketch')
        p5.pixelDensity(pixelDens)
        p5.colorMode(p5.HSB)
        p5.sb = new PRNGRand(new Date().getMilliseconds())
        colorScheme = new ColorScheme(p5)
        p5.noSmooth();
        p5.frameRate(24)

        scene = createScene(p5,colorScheme, gridSize)
    }

    p5.mouseReleased = () => {
        p5.loop()
    }

    p5.keyPressed = () => {
        if (p5.key === 'r') {
            recording = !recording
            if (recording) {
                record()
            } else {
                exportVideo()
            }
        }

        if (p5.key === 's') {
            p5.saveCanvas('sketch-d6', 'png')
        }

        keysDown[p5.keyCode]=true
    }

    p5.keyReleased=()=>{

        keysDown[p5.keyCode]=false
    }

    p5.draw = () => {


        const resolution = {x: 10, y: 10}
        const viewport = {w: p5.width / resolution.x, h: p5.height / resolution.y}
        if (!p5.keyIsPressed) {
            keysDown={};
        }
        if (p5.keyIsPressed) {
            if (keysDown[p5.LEFT_ARROW]) {
                px -= 1
                px = Math.max(px, 0)
            }else
            if (keysDown[p5.RIGHT_ARROW]) {
                px += 1
                px = Math.min(px, scene.width - 1 - viewport.w)
            }
            if (keysDown[p5.UP_ARROW]) {
                py -= 1
                py = Math.max(py, 0)
            }else
            if (keysDown[p5.DOWN_ARROW]) {
                py += 1
                py = Math.min(py, scene.height - 1 - viewport.h)
            }
        }


        p5.push()
        p5.background(0)
        drawScene(p5, scene, px, py, resolution, viewport);


    }
    // var recorder=null;
    const record = () => {
        chunks.length = 0;
        let stream = document.querySelector('canvas').captureStream(30)
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            if (e.data.size) {
                chunks.push(e.data);
            }
        };
        recorder.start();

    }

    const exportVideo = (e) => {
        recorder.stop();

        setTimeout(() => {
            var blob = new Blob(chunks);
            var vid = document.createElement('video');
            vid.id = 'recorded'
            vid.controls = true;
            vid.src = URL.createObjectURL(blob);
            document.body.appendChild(vid);
            vid.play();
        }, 1000)
    }
}


new p5(sketch);
