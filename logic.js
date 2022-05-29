// person line item class
class Person {
    constructor(name, preTaxAmount) {
        this.name = name
        this.preTaxAmount = preTaxAmount
    }

    portionOf(preTax, postTip) {
        // contribution to the post-tip amount that this Person must pay
        // based on their contribution to the pre-tax amount
        return (this.preTaxAmount / preTax * postTip)

    }
}

// bill class
class Bill {
    constructor(preTaxTotal, taxAmt) {
        this.preTaxTotal = preTaxTotal
        this.taxAmt = taxAmt

        this.postTaxTotal = this.preTaxTotal + this.taxAmt

        // declare all fields that we want to use and null them
        this.tipAmt = null
        this.tipPctPreTax = null
        this.tipPctPostTax = null
        this.postTipTotal = null
    }

    // functions to handle tip
    // tip from percentage either pre- or post-tax
    computeTipFromPercent(taxPct, usePostTax) {
        if (usePostTax) {
            // if using post-tax amount
            this.tipPctPostTax = taxPct
            this.tipAmt = (this.tipPctPostTax / 100) * this.postTaxTotal
            this.tipPctPreTax = 100 * this.tipAmt / this.preTaxTotal
        } else {
            // if using pre-tax amount
            this.tipPctPreTax = taxPct
            this.tipAmt = (this.tipPctPreTax / 100) * this.preTaxTotal
            this.tipPctPostTax = 100 * this.tipAmt / this.postTaxTotal

            
        }
        this.postTipTotal = this.postTaxTotal + this.tipAmt
    }

    // tip from total
    computeTipFromTotal(postTipTotal) {
        this.postTipTotal = postTipTotal
        this.tipAmt = this.postTipTotal - this.postTaxTotal
        this.tipPctPreTax = 100 * this.tipAmt / this.preTaxTotal
        this.tipPctPostTax = 100 * this.tipAmt / this.postTaxTotal

    }

    // tip from specified dollar amount
    computeTipFromAmt(tipAmt) {
        this.tipAmt = tipAmt
        this.tipPctPreTax = 100 * this.tipAmt / this.preTaxTotal
        this.tipPctPostTax = 100 * this.tipAmt / this.postTaxTotal
        this.postTipTotal = this.postTaxTotal + this.tipAmt
    }
}

// get all people from frontend and turn them into a list of Person objects
personList = []

personList.push(new Person("Dan", 19.45))
personList.push(new Person("Anoush", 16))

// get tax amount from frontend
function getTaxFromFrontend() {
    return 3.01
}

// calculate pre-tax total from list of Person objects
// credit:
// https://bobbyhadz.com/blog/javascript-get-sum-of-array-object-values
preTax = personList.reduce((accumulator, object) => {
    return accumulator + object.preTaxAmount
}, 0)

// initialize Bill object
thisBill = new Bill(preTax, getTaxFromFrontend())

// logic for tipping based on frontend selection
// function to determine which tip handling Bill method to call

// display pre-tax, tax, post-tax, tip (h), post-tip (h) amounts, and
// portionOf (h) for each person
// function to read fields from the Bill object
function testPrintBillFields(bill) {
    console.log("subtotal: " + bill.preTaxTotal)
    console.log("tax: " + bill.taxAmt)
    console.log("post-tax: " + bill.postTaxTotal)
    console.log("tip: " + bill.tipAmt)
    console.log("tip percent pre-tax: " + bill.tipPctPreTax)
    console.log("tip percent post-tax: " + bill.tipPctPostTax)
    console.log("TOTAL: " + bill.postTipTotal)
}