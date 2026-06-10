class Utils {
    graphicLibrary = {}
    canvas = {}

    isMobile = false;
    isLandscape = false;

    areShadowEnabled = true;
    isMusicEnabled = true;
    programInfo = {}

    isgGamePadConnected = false;
    gamepadAPI = {
        controller: {},
        turbo: false,
        //XBOX 360 SETUP
        // buttons: [
        //     "DPad-Up", "DPad-Down", "DPad-Left", "DPad-Right",
        //     "Start", "Back", "Axis-Left", "Axis-Right",
        //     "LB", "RB", "Power", "A", "B", "X", "Y",
        // ],

        buttons: [
            "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11",
        ],
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: [],
    };

    constructor() {
        if (!!Utils.instance) {
            return Utils.instance;
        }

        Utils.instance = this;


        this.setMobileEventListeners()
        this.setJoystickEventListeners()

        return this;
    }



    async loadFile(filePath) {
        const response = await fetch(filePath);
        return response.text()
    }

    // https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
    setJoystickEventListeners() {
        window.addEventListener("gamepadconnected", (e) => {
            this.connect(e);
            console.log(e.gamepad.buttons)
        });

        window.addEventListener("gamepaddisconnected", this.disconnect);
    }

    // https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
    connect(event) {
        // debugger
        this.isgGamePadConnected = true;
        this.gamepadAPI.controller = event.gamepad;
        this.gamepadAPI.turbo = true;
        console.log("Gamepad connected.");
        console.log(
            "Gamepad connected at index %d: %s. %d buttons, %d axes.",
            event.gamepad.index,
            event.gamepad.id,
            event.gamepad.buttons.length,
            event.gamepad.axes.length,
        );

    }

    // https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
    updateJoystickInput() {
        // Clear the buttons cache
        this.gamepadAPI.buttonsCache = [];

        // Move the buttons status from the previous frame to the cache
        for (let k = 0; k < this.gamepadAPI.buttonsStatus.length; k++) {
            this.gamepadAPI.buttonsCache[k] = this.gamepadAPI.buttonsStatus[k];
        }

        // Clear the buttons status
        this.gamepadAPI.buttonsStatus = [];

        // Get the gamepad object
        const c = this.gamepadAPI.controller || {};

        // Loop through buttons and push the pressed ones to the array
        const pressed = [];
        if (c.buttons) {
            for (let b = 0; b < c.buttons.length; b++) {
                if (c.buttons[b].pressed) {
                    pressed.push(this.gamepadAPI.buttons[b]);
                }
            }
        }

        // Loop through axes and push their values to the array
        const axes = [];
        if (c.axes) {
            // debugger
            for (const ax of c.axes) {
                axes.push(ax.toFixed(2));
            }
        }

        // Assign received values
        this.gamepadAPI.axesStatus = axes;
        this.gamepadAPI.buttonsStatus = pressed;

        // console.log(axes)
        // console.log(pressed)
        this.manageJoystickInput()
    }

    // https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
    buttonPressed(button, hold) {
        let newPress = false;
        if (this.gamepadAPI.buttonsStatus.includes(button)) {
            newPress = true;
        }
        if (!hold && this.gamepadAPI.buttonsCache.includes(button)) {
            newPress = false;
        }
        return newPress;
    }

    //B2 -> X
    //B1 -> O
    //B3 -> []
    //B0 -> TRIANGLE
    //B6 -> L1
    //B7 -> R1
    //AXIS4 -1 -> LEFT BUTTON
    //AXIS4 1 -> RIGHT BUTTON
    manageJoystickInput() {
        // debugger
        var axis = parseInt(this.gamepadAPI.axesStatus[4])
        if (axis < 0) {
            this.onLeftTouch()
        } else if (axis == 0) {
            this.onLeftRelease()
            this.onRightRelease()
        } else if (axis > 0) {
            this.onRightTouch();
        }

        if (this.buttonPressed("B2", "hold")) {
            this.onForwardTouch();
        } else {
            this.onForwardRelease();
        }

        if (this.buttonPressed("B3", "hold")) {
            this.onBackTouch();
        } else {
            this.onBackRelease();
        }
    }

    disconnect(evt) {
        this.isgGamePadConnected = false;
        if (this.gamepadAPI != undefined) {
            this.gamepadAPI.turbo = false;
            this.gamepadAPI.controller = {};
        }

        console.log("Gamepad disconnected.");
    }


    onLeftTouch() {
        // debugger
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'a',
            code: 'KeyA',
            bubbles: true,
            composed: true
        }));

    }

    onLeftRelease() {
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'a',
            code: 'KeyA',
            bubbles: true,
            composed: true
        }));
    }

    onRightTouch() {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'd',
            code: 'KeyD',
            bubbles: true,
            composed: true
        }));
    }

    onRightRelease() {
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'd',
            code: 'KeyD',
            bubbles: true,
            composed: true
        }));
    }

    onForwardTouch(
    ) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'w',
            code: 'KeyW',
            bubbles: true,
            composed: true
        }));
    }

    onForwardRelease() {
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'w',
            code: 'KeyW',
            bubbles: true,
            composed: true
        }));
    }

    onBackTouch() {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 's',
            code: 'KeyS',
            bubbles: true,
            composed: true
        }));
    }

    onBackRelease() {
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: 's',
            code: 'KeyS',
            bubbles: true,
            composed: true
        }));
    }

    setMobileEventListeners() {
        window.addEventListener('is-mobile', () => {
            this.isMobile = true
        })

        window.addEventListener('not-is-mobile', () => {
            this.isMobile = false

        })

        window.addEventListener('is-portrait', () => {
            this.isLandscape = false;
        })


        window.addEventListener('not-is-portrait', () => {
            this.isLandscape = true;
        })
    }

    setContext(canvas, graphicLibrary) {
        this.graphicLibrary = graphicLibrary
        this.canvas = canvas
    }

    setProgramInfo(programInfo) {
        this.programInfo = programInfo
    }

    degToRad(d) {
        return d * Math.PI / 180;
    }

}

export const utils = new Utils();