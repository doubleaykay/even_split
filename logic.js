// extract dinero object value and convert to float
function d2f(d) {
    return d.getAmount() / 100
}

// person line item class
class Person {
    constructor(name, preTaxAmount) {
        this.name = name
        this.preTaxAmount = preTaxAmount

        this.contributionPct = null
        this.contributionAmt = null
    }

    calculatePortion(preTaxTotal, postTipTotal) {
        // contribution to the post-tip amount that this Person must pay
        // based on their contribution to the pre-tax amount
        // this.contributionAmt = this.preTaxAmount / preTaxTotal * postTipTotal
        this.contributionPct = d2f(this.preTaxAmount) / d2f(preTaxTotal)
    }
}

// bill class
class Bill {
    constructor(preTaxTotal, taxAmt) {
        this.preTaxTotal = preTaxTotal
        this.taxAmt = taxAmt

        this.postTaxTotal = this.preTaxTotal.add(this.taxAmt)

        // declare all fields that we want to use and null them
        this.tipAmt = null
        this.tipPctPreTax = null
        this.tipPctPostTax = null
        this.postTipTotal = null
    }

    // extract dinero object value and convert to float
    // d2f = d => d.getAmount() / 100
    // d2f(d) {
    //     return d.getAmount() / 100
    // }

    // functions to handle tip
    // tip from percentage either pre- or post-tax
    computeTipFromPercent(taxPct, usePostTax) {
        if (usePostTax) {
            // if using post-tax amount
            this.tipPctPostTax = taxPct
            // this.tipAmt = (this.tipPctPostTax / 100) * this.postTaxTotal
            this.tipAmt = this.postTaxTotal.percentage(this.tipPctPostTax)
            this.tipPctPreTax = 100 * d2f(this.tipAmt) / d2f(this.preTaxTotal)
        } else {
            // if using pre-tax amount
            this.tipPctPreTax = taxPct
            this.tipAmt = this.preTaxTotal.percentage(this.tipPctPreTax)
            this.tipPctPostTax = 100 * d2f(this.tipAmt) / d2f(this.postTaxTotal)


        }
        this.postTipTotal = this.postTaxTotal.add(this.tipAmt)
    }

    // tip from total
    computeTipFromTotal(postTipTotal) {
        this.postTipTotal = postTipTotal
        this.tipAmt = this.postTipTotal.subtract(this.postTaxTotal)
        this.tipPctPreTax = 100 * d2f(this.tipAmt) / d2f(this.preTaxTotal)
        this.tipPctPostTax = 100 * d2f(this.tipAmt) / d2f(this.postTaxTotal)
    }

    // tip from specified dollar amount
    computeTipFromAmt(tipAmt) {
        this.tipAmt = tipAmt
        this.tipPctPreTax = 100 * d2f(this.tipAmt) / d2f(this.preTaxTotal)
        this.tipPctPostTax = 100 * d2f(this.tipAmt) / d2f(this.postTaxTotal)
        this.postTipTotal = this.postTaxTotal.add(this.tipAmt)
    }
}

function parseFrontendCurrency(frontendCurrency) {
    // initiate regex instance
    regex = new RegExp(/^\$?((\d*(\.\d\d)?)|(\.\d\d))$/)

    // check if input string matches regex
    // if yes, then parse it
    // if no, throw an error
    if (regex.test(frontendCurrency)) {

        // check if currency has cents and parse accordingly
        if (frontendCurrency.includes(".")) {
            dollars = parseInt(frontendCurrency.split(".")[0])
            // console.log(dollars)
            cents = parseInt(frontendCurrency.split(".")[1])
            // console.log(cents)
            amountDinero = dollars * 100 + cents
            // console.log(amountDinero)
        } else {
            amountDinero = parseInt(frontendCurrency) * 100
            // console.log(amountDinero)
        }

        return Dinero({ amount: amountDinero, currency: 'USD' })
    } else {
        console.log("Input did not pass regex: " + frontendCurrency)
    }
}

// function testBuildPersonArray() {
//     // create empty people array
//     personList = []
//     // get all "person" elements from frontend
//     frontendList = document.getElementsByClassName("person-line")
//     // convert the html collection to an array
//     frontendList = Array.prototype.slice.call(frontendList)
//     // for each "person" on that list, create a person object with right params
//     frontendList.forEach(person => {
//         personName = person.childNodes[3].value
//         personTotal = parseFrontendCurrency(person.childNodes[7].value)

//         // put these into a person object and append to a person list!
//         personList.push(new Person(personName, personTotal))
//         // console.log(personName)
//         // console.log(personTotal)
//     })
// }

function computeBill() {
    // create empty people array
    personList = []
    // get all "person" elements from frontend
    frontendList = document.getElementsByClassName("person-line")
    // convert the html collection to an array
    frontendList = Array.prototype.slice.call(frontendList)
    // for each "person" on that list, create a person object with right params
    frontendList.forEach(person => {
        personName = person.childNodes[3].value
        personTotal = parseFrontendCurrency(person.childNodes[7].value)

        // put these into a person object and append to a person list!
        personList.push(new Person(personName, personTotal))
        // console.log(personName)
        // console.log(personTotal)
    })

    // get tax amount from frontend
    function getTaxFromFrontend() {
        // return parseFloat(document.getElementById("tax-line").childNodes[3].value)
        return parseFrontendCurrency(document.getElementById("tax-line").childNodes[3].value)
    }

    // calculate pre-tax total from list of Person objects
    // credit:
    // https://bobbyhadz.com/blog/javascript-get-sum-of-array-object-values
    // preTax = personList.reduce((accumulator, object) => {
    //     return accumulator + object.preTaxAmount
    // }, 0)
    preTax = personList.reduce((accumulator, object) => {
        return accumulator.add(object.preTaxAmount)
    }, Dinero({ amount: 0, currency: 'USD' }))

    // initialize Bill object
    thisBill = new Bill(preTax, getTaxFromFrontend())

    // logic for tipping based on frontend selection
    // function to determine which tip handling Bill method to call
    tipMethod = document.getElementById("tip-line").childNodes[1].value

    if (tipMethod == "preTaxPct") {
        tipValue = parseFloat(document.getElementById("tip-line").childNodes[3].value)
        thisBill.computeTipFromPercent(tipValue, false)
    } else if (tipMethod == "postTaxPct") {
        tipValue = parseFloat(document.getElementById("tip-line").childNodes[3].value)
        thisBill.computeTipFromPercent(tipValue, true)
    } else if (tipMethod == "tipAmt") {
        tipValue = parseFrontendCurrency(document.getElementById("tip-line").childNodes[3].value)
        thisBill.computeTipFromAmt(tipValue)
    } else if (tipMethod == "totalAmt") {
        tipValue = parseFrontendCurrency(document.getElementById("tip-line").childNodes[3].value)
        thisBill.computeTipFromTotal(tipValue)
    }

    // thisBill.computeTipFromAmt(8)

    // compute each person's contribution amount
    pctArray = []
    personList.forEach(person => {
        person.calculatePortion(thisBill.preTaxTotal, thisBill.postTipTotal)
        pctArray.push(person.contributionPct)
    })

    portionedTotal = thisBill.postTipTotal.allocate(pctArray)
    portionedTotal.forEach((contributionAmt, index) => {
        personList[index].contributionAmt = contributionAmt
    })

    return [personList, thisBill]
}