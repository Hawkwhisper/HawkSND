/**
 * @author William Ramsey
 * @description A neat sound API meant for emulating original retro hardware.
 */

 class PulseCH {
    constructor() {
        this._initVars()
        this._generate();
    }

    /**
     * Initializes self variabels
     */
    _initVars() {
        this.context = null;
        this.oscillator = null;
        this.volume = null;
        this.lastVolume = 0;
        this.lastFreq = 0;
    }

    /**
     * Used to generate at inialization
     */
    _generate() {
        this.context = new AudioContext({})
        this.oscillator = this.context.createOscillator();
        this.volume = this.context.createGain();
        this.oscillator.connect(this.volume);

        this.volume.gain.value = 0.000001;
        this.volume.connect(this.context.destination);

        this.oscillator.start();
    }

    /**
     * Sets the frequency
     * @param value 
     */
    _setFreq(value) {
        this.lastFreq = value;
        this.oscillator.frequency.value = this.lastFreq / 12;
    }

    /**
     * Sets the volume
     * 1-100
     * @param value 
     */
    _setVolume(value) {
        this.lastVolume = value / 100;
        this.volume.gain.value = this.lastVolume;
    }

    /**
     * Plays the current source
     */
    play() {
        this.context.resume();
    }

    /**
     * Stops the sound
     */
    stop() {
        this.context.suspend();
    }

    /**
     * 0 = noise
     * 1 = wave
     * @param mode 
     */
    setSource(mode) {
        switch (mode) {
            case 0:
                this.oscillator.type = "square";
                break;
            case 1:
                this.oscillator.type = "sawtooth";
                break;
            case 2:
                this.oscillator.type = "triangle";
                break;
            case 3:
                this.oscillator.type = "sine";
                break;
        }
    }
}

module.exports = PulseCH;