$(document).ready(() => {
  console.log('jquery')
  // var userHoldingData = (<%- JSON.stringify(holdings) %>);
  console.log(userHoldingData)
  // console.log(JSON.stringify(userHoldingData))
  const listofstocks = []
  const bodyUserHoldingData = []
  for (let i = 0; i < userHoldingData.body.data.length; i++) {
    if (userHoldingData.body.data[i].quantity > 0) {
      listofstocks.push(userHoldingData.body.data[i].tradingsymbol)
      bodyUserHoldingData.push(userHoldingData.body.data[i])
    }
  }

  $.post('http://localhost:8080/fetchlimits', { listofstocks })
    .done(backEndResponse => {
      console.log('response recvd from backend')
      // console.log(response)
      const response = backEndResponse.response
      for (let rowIndex = 0; rowIndex < response.length; rowIndex++) {
      	const stock = bodyUserHoldingData[rowIndex]
      	const cellElement = document.getElementById('userholdingstable').rows[rowIndex + 1].cells[6]
      	const pnlPercent = Math.floor(stock.pnl * 10000 / (stock.average_price * (stock.quantity + stock.t1_quantity))) / 100
        const individualResponseElem = response[rowIndex]
        // console.log(response[rowIndex])
        // console.log(individualResponseElem.profitPercent)
        if (pnlPercent > individualResponseElem.profitPercent) {
        	cellElement.classList.add('positive')
        } else if (pnlPercent < individualResponseElem.lossPercent) {
        	cellElement.classList.add('negative')
        }
        cellElement.innerHTML = JSON.stringify(response[rowIndex])
      }
    })
    .fail(() => {
      alert('error')
    })
})
