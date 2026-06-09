class Utils {
    graphicLibrary = {}
    canvas = {}

    isMobile = false;
    isLandscape = false;
    programInfo = {}
    constructor() {
        if (!!Utils.instance) {
            return Utils.instance;
        }

        Utils.instance = this;
        window.addEventListener('is-mobile', () =>{
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
        return this;
    }

    async loadFile(filePath) {
        const response = await fetch(filePath);
        return response.text()
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