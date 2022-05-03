const soundData = require('../soundData.json');

/**
 * Noise Channel, contains both static noise and that weird metalic sound
 * the noise channel can make. The opening of Metal Crusher from Undertale
 * is a prime example of this thing.
 */
 class NoiseCH {
    constructor() {
        this._initVars()
        this._generate();
    }

    /**
     * Initializes self variabels
     */
    _initVars() {
        this.noiseContext = null;
        this.noiseSource = null;
        this.noiseBuffer = null;
        this.waveContext = null;
        this.waveSource = null;
        this.waveBuffer = null;
        this.noiseGain = null;
        this.waveGain = null;
        this.lastFreq = 0;
        this.lastVolume = 0;
    }

    /**
     * Used to generate at inialization
     */
    _generate() {
        this.noiseContext = new (window.AudioContext || window.webkitAudioContext)();
        this.waveContext = new (window.AudioContext || window.webkitAudioContext)();
        const noiseContext = this.noiseContext;
        const waveContext = this.waveContext;

        const waveRepeat = soundData.NESBuffer;
        const noiseBuffer = noiseContext.createBuffer(2, noiseContext.sampleRate * 3, noiseContext.sampleRate);
        for (var channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
            var now = noiseBuffer.getChannelData(channel);
            for (var i = 0; i < noiseBuffer.length; i += 1) {
                now[i] = (Math.random() * 2) - 1
            }
        }
        this.noiseBuffer = noiseBuffer;

        const waveBuffer = waveContext.createBuffer(2, waveContext.sampleRate * 3, waveContext.sampleRate);
        for (var channel = 0; channel < waveBuffer.numberOfChannels; channel++) {
            var now = waveBuffer.getChannelData(channel);
            for (var i = 0; i < waveBuffer.length; i += 1) {
                now[i] = waveRepeat[i % waveRepeat.length]
            }
        }
        this.waveBuffer = waveBuffer;

        this.noiseSource = this.noiseContext.createBufferSource();
        this.noiseSource.loop = true;
        this.noiseSource.buffer = this.noiseBuffer;

        this.waveSource = this.waveContext.createBufferSource();
        this.waveSource.loop = true;
        this.waveSource.buffer = this.waveBuffer;
        this.currentSource = this.waveSource;
        this.noiseSource.start();
        this.waveSource.start();
        this.noiseContext.suspend();
        this.waveContext.suspend();

        this.noiseGain = this.noiseContext.createGain();
        this.noiseGain.connect(this.noiseContext.destination);

        this.waveGain = this.waveContext.createGain();
        this.waveGain.connect(this.waveContext.destination);

        console.log(this.noiseGain);

        this.noiseSource.connect(this.noiseGain);
        this.waveSource.connect(this.waveGain);


        this._setVolume(1);
        this._setFreq(2);
        this.setSource(0);
    }

    /**
     * Sets the frequency
     * @param value 
     */
    _setFreq(value) {
        this.lastFreq = value;
        this.currentSource.playbackRate.value = this.lastFreq / 12;
    }

    /**
     * Sets the volume
     * 1-100
     * @param value 
     */
    _setVolume(value) {
        this.lastVolume = value / 100;
        this.noiseGain.gain.setValueAtTime(this.lastVolume, this.noiseContext.currentTime);
        this.waveGain.gain.setValueAtTime(this.lastVolume, this.waveContext.currentTime);
    }

    /**
     * Plays the current source
     */
    play() {
        this.currentSource.context.resume();
    }

    /**
     * Stops the sound
     */
    stop() {
        this.noiseContext.suspend();
        this.waveContext.suspend();
    }

    /**
     * 0 = noise
     * 1 = wave
     * @param mode 
     */
    setSource(mode) {
        switch (mode) {
            case 0:
                if (this.currentSource != this.noiseSource) {
                    this.currentSource = this.noiseSource;
                    this.waveContext.suspend();
                    this.play();
                    this._setFreq(this.lastFreq);
                    this._setFreq(this.lastVolume);
                }
                break;
            case 1:
                if (this.currentSource != this.waveSource) {
                    this.currentSource = this.waveSource;
                    this.noiseContext.suspend();
                    this.play();
                    this._setFreq(this.lastFreq);
                    this._setFreq(this.lastVolume);
                }
                break;
        }
    }
}

module.exports = NoiseCH;