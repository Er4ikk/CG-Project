class Utils {
    graphicLibrary = {}
    canvas = {}

    textureProgramInfo = {}
    colorProgramInfo = {}

    programInfo = {}
    constructor() {
        if (!!Utils.instance) {
            return Utils.instance;
        }

        Utils.instance = this;


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