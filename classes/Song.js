const fs = require('fs');
const PulseCH = require('./PulseCH');
const NoiseCH = require('./NoiseCH');

class Song{
    constructor() {
        this.channels = [new PulseCH(), new PulseCH(), new PulseCH(), new NoiseCH()]
        this.pulseChannel1 = this.channels[0];
        this.pulseChannel2 = this.channels[1];
        this.pulseChannel3 = this.channels[2];
        this.noiseChannel = this.channels[3];
        this.index = 0;

        this.trackData = [
            [],
            [],
            [],
            []
        ];


        setInterval(() => {
            this.index++;
            for (let i in this.channels) {
                const idata = this.trackData[i][this.index % this.trackData[i].length];
                try {
                    this.channels[i].setSource(idata[0]);
                    this.channels[i]._setFreq(idata[1] || this.channels[i].lastFreq)
                    this.channels[i]._setVolume(idata[2] || this.channels[i].lastVolume)
                } catch {

                }
            }
        }, 1000 / 60)
    }

    parse(str) {
        fs.readdir(str, 'utf-8', (err, files) => {
            if (err) throw err;
            files.forEach((a, b) => {
                fs.readFile(`${str}/${a}`, 'utf-8', (err, _data) => {
                    if (err) throw err;
                    const _channel = Number(a.replace('.txt', '')) - 1;
                    const res = [];
                    _data.split('\n').forEach((a, b) => {
                        const data = [];
                        a.split(':').forEach((aa, bb) => {
                            data.push(Number(aa));
                        })
                        res.push(data);
                    })

                    this.trackData[_channel] = res;
                })
            })
        })


    }
}

module.exports = Song;