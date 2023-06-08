const { expect } = require('chai')

describe("This is Backend testing", async () => {

    before(() => {
        console.log("Before block");
    })
    after(() => {
        console.log("after block");
    })
    it("First test", () => {
        expect(1).to.equal(1);
    })
})