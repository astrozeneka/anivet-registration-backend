
class TestResult{
    #id = null
    #testSampleId = null
    #sciDocId = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get testSampleId() {
        return this.#testSampleId;
    }

    set testSampleId(value) {
        this.#testSampleId = value;
    }

    get sciDocId() {
        return this.#sciDocId;
    }

    set sciDocId(value) {
        this.#sciDocId = value;
    }
}
module.exports = TestResult
