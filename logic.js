// extract dinero object value and convert to float
function d2f(d) {
    return d.getAmount() / 100
}

// person line item class
class Person {
    constructor(name, preTaxAmount, paymentType) {
        this.name = name
        this.preTaxAmount = preTaxAmount
        this.paymentType = paymentType

        this.contributionPct = null
        this.contributionAmt = null
    }

    calculatePortion(preTaxTotal) {
        // contribution to the post-tip amount that this Person must pay
        // based on their contribution to the pre-tax amount
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

    // functions to handle tip
    // tip from percentage either pre- or post-tax
    computeTipFromPercent(taxPct, usePostTax) {
        if (usePostTax) {
            // if using post-tax amount
            this.tipPctPostTax = taxPct
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
            cents = parseInt(frontendCurrency.split(".")[1])
            amountDinero = dollars * 100 + cents
        } else {
            amountDinero = parseInt(frontendCurrency) * 100
        }

        return Dinero({ amount: amountDinero, currency: 'USD' })
    } else {
        console.log("Input did not pass regex: " + frontendCurrency)
    }
}

function computeBill() {
    // create empty people array
    personList = []
    // get all "person" elements from frontend
    frontendList = document.getElementsByClassName("person-line")
    // convert the html collection to an array
    frontendList = Array.prototype.slice.call(frontendList)
    // for each "person" on that list, create a person object with right params
    frontendList.forEach(person => {
        personName = person.childNodes[1].value
        personTotal = parseFrontendCurrency(person.childNodes[3].value)
        personPaymentType = person.childNodes[5].value

        // put these into a person object and append to a person list!
        personList.push(new Person(personName, personTotal, personPaymentType))
    })

    // get tax amount from frontend
    function getTaxFromFrontend() {
        // return parseFloat(document.getElementById("tax-line").childNodes[3].value)
        return parseFrontendCurrency(document.getElementById("tax-line").childNodes[3].value)
    }

    // calculate pre-tax total from list of Person objects
    // credit:
    // https://bobbyhadz.com/blog/javascript-get-sum-of-array-object-values
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

    // compute each person's contribution percent
    pctArray = []
    personList.forEach(person => {
        person.calculatePortion(thisBill.preTaxTotal, thisBill.postTipTotal)
        pctArray.push(person.contributionPct)
    })

    // determine each person's cash portion and save it to the person object
    portionedTotal = thisBill.postTipTotal.allocate(pctArray)
    portionedTotal.forEach((contributionAmt, index) => {
        personList[index].contributionAmt = contributionAmt
    })

    // for those paying in cash, ensure they have a round number by refiguring everyone's contributions

    // advanced option: ensure tip is a round number and refigure everyone's contributions

    return [personList, thisBill]
}