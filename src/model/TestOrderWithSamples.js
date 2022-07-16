const TestOrder = require("./TestOrder");

class TestOrderWithSamples extends TestOrder {
    #samples = []

    get samples() {
        return this.#samples;
    }

    set samples(value) {
        this.#samples = value;
    }

    serialize(){
        let output = super.serialize()
        output.samples = []
        for(const sample of this.samples)
            output.samples.push(sample.serialize())
        return output
    }
}

module.exports = TestOrderWithSamples