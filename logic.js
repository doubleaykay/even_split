// person line item class
class Person {
    constructor(name, preTaxAmount) {
        this.name = name;
        this.preTaxAmount = preTaxAmount;
    }

    portionOf(preTax, postTip) {
        // contribution to the post-tip amount that this Person must pay
        // based on their contribution to the pre-tax amount
        return (this.preTaxAmount / preTax * postTip)

    }
}

// get all people from frontend and turn them into a list of Person objects

// calculate pre-tax total from list of Person objects

// logic for tipping based on frontend selection

// compute post-tax amount

// display pre-tax, tax, post-tax, tip (h), post-tip (h) amounts, and
// portionOf (h) for each person