function addAnotherPersonToFrontend() {
    people_container = document.querySelector("#people-list-container")
    template = document.querySelector("#person_row_template")
    people_container.appendChild(template.content.cloneNode(true))
}

// format currency input to be correct always
// kudos https://stackoverflow.com/a/50722629
function formatFrontendCurrency(e) {
    const value = e.value.replace(/,/g, '');
    e.value = parseFloat(value).toLocaleString('en-US', {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

// display pre-tax, tax, post-tax, tip (h), post-tip (h) amounts, and
// portionOf (h) for each person
// function to read fields from the Bill object
function displayResults(people, bill) {
    results_string = "subtotal: " + bill.preTaxTotal.toFormat('$0,0.00') + "<br>" + "tax: " + bill.taxAmt.toFormat('$0,0.00') + "<br>" + "post-tax: " + bill.postTaxTotal.toFormat('$0,0.00') + "<br>" + "tip: " + bill.tipAmt.toFormat('$0,0.00') + "<br>" + "tip percent pre-tax: " + bill.tipPctPreTax + "<br>" + "tip percent post-tax: " + bill.tipPctPostTax + "<br>" + "TOTAL: " + bill.postTipTotal.toFormat('$0,0.00') + "<br>"

    resultsDiv = document.getElementById("results")

    people.forEach(e => {
        results_string = results_string + e.name + " pays " + e.contributionAmt.toFormat('$0,0.00') + "<br>"
    })

    resultsDiv.innerHTML = results_string
    console.log(results.string)
}

function testPrintBillFields(people, bill) {
    console.log("subtotal: " + bill.preTaxTotal)
    console.log("tax: " + bill.taxAmt)
    console.log("post-tax: " + bill.postTaxTotal)
    console.log("tip: " + bill.tipAmt)
    console.log("tip percent pre-tax: " + bill.tipPctPreTax)
    console.log("tip percent post-tax: " + bill.tipPctPostTax)
    console.log("TOTAL: " + bill.postTipTotal)
    console.log("")
    people.forEach(e => {
        console.log(e.name)
        console.log(e.contributionAmt)
    })
}

function runLogic() {
    res = computeBill()
    displayResults(res[0], res[1])
}