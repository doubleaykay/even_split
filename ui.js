function addAnotherPersonToFrontend() {
    // node = document.getElementById("person-line-element")
    // document.getElementById("people-list-container").appendChild(node.cloneNode(true))

    people_container = document.querySelector("#people-list-container")
    template = document.querySelector("#person_row_template")
    people_container.appendChild(template.content.cloneNode(true))
}

// display pre-tax, tax, post-tax, tip (h), post-tip (h) amounts, and
// portionOf (h) for each person
// function to read fields from the Bill object
function displayResults(people, bill) {
    results_string = "subtotal: " + bill.preTaxTotal + "<br>" + "tax: " + bill.taxAmt + "<br>" + "post-tax: " + bill.postTaxTotal + "<br>" + "tip: " + bill.tipAmt + "<br>" + "tip percent pre-tax: " + bill.tipPctPreTax + "<br>" + "tip percent post-tax: " + bill.tipPctPostTax + "<br>" + "TOTAL: " + bill.postTipTotal + "<br>"

    resultsDiv = document.getElementById("results")
    // br = document.createElement("br")

    // resultsDiv.appendChild(document.createTextNode("subtotal: " + bill.preTaxTotal + "\n"))
    // resultsDiv.appendChild(br)
    // resultsDiv.appendChild(document.createTextNode("tax: " + bill.taxAmt + "\n"))
    // resultsDiv.appendChild(br)
    // resultsDiv.appendChild(document.createTextNode("post-tax: " + bill.postTaxTotal + "\n"))
    // resultsDiv.appendChild(br)
    // resultsDiv.appendChild(document.createTextNode("tip: " + bill.tipAmt + "\n"))
    // resultsDiv.appendChild(br)
    // resultsDiv.appendChild(document.createTextNode("tip percent pre-tax: " + bill.tipPctPreTax + "\n"))
    // resultsDiv.appendChild(br)
    // resultsDiv.appendChild(document.createTextNode("tip percent post-tax: " + bill.tipPctPostTax + "\n"))
    // resultsDiv.appendChild(br)
    // resultsDiv.appendChild(document.createTextNode("TOTAL: " + bill.postTipTotal + "\n"))
    // resultsDiv.appendChild(br)

    people.forEach(e => {
        // resultsDiv.appendChild(document.createTextNode(e.name + " pays $" + e.contributionAmt + "\n"))
        // resultsDiv.appendChild(br)

        results_string = results_string + e.name + " pays $" + e.contributionAmt + "<br>"
    })

    resultsDiv.innerHTML = results_string
    console.log(results.string)
    // console.log("Dan contribution: " + personList[0].contributionAmt)
    // console.log("Anoush contribution: " + personList[1].contributionAmt)
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
    // console.log("Dan contribution: " + personList[0].contributionAmt)
    // console.log("Anoush contribution: " + personList[1].contributionAmt)
}

function runLogic() {
    res = computeBill()
    displayResults(res[0], res[1])
}