class SoundManager {

    soundtrack = new Audio("../../../resources/audio/soundtrack.mp3")
    brake = new Audio("../../../resources/audio/brake.mp3")
    accellerate = new Audio("../../../resources/audio/accellerate.mp3")

    constructor() {
        if (!!SoundManager.instance) {
            return SoundManager.instance;
        }

        SoundManager.instance = this;

        this.accellerate.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);


        return this;
    }

    playSoundtrack() {
        this.soundtrack.play()
    }

    stopSoundTrack() {
        this.soundtrack.pause()
    }

    playBrake() {
        this.brake.play();
    }

    stopBrake() {
        this.brake.pause();
        // https://stackoverflow.com/questions/13002935/html5-audio-start-over
        this.accellerate.currentTime = 0
    }

    playAccellerate() {
        this.accellerate.play()
    }

    stopAccellerate() {
        this.accellerate.pause()
        // https://stackoverflow.com/questions/13002935/html5-audio-start-over
        this.accellerate.currentTime = 0
    }


}

export const soundManager = new SoundManager();