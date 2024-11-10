const getters = {
  areaCodeData(state) {
    const returnData = {
      indexBar: [],
      areaCode: [],
      mainArea: []
    }
    const areaCode = [...state.common.areaCode]

    returnData.mainArea = areaCode.filter(data => (data.state == 1))

    areaCode.sort((param1, param2) => {
      return param1.country.localeCompare(param2.country, 'zh')
    }
    )

    const indexBar = []
    areaCode.forEach(data => {
      if (!indexBar.includes(data.initials)) {
        indexBar.push(data.initials)
      }
    })

    indexBar.sort()
    indexBar.forEach(key => {
      const indexBarData = { key: key, data: [] }
      areaCode.forEach(data => {
        if (key == data.initials) {
          indexBarData.data.push(data)
        }
      })

      returnData.areaCode.push(indexBarData)
    })
    returnData.indexBar = [...indexBar]

    return returnData
  },

  withdrawCoinList(state) {
    const coinList = state.wallet.rechargeCoinArr
    const coinListCopy = []
    const coinNameArr = []
    const resCoinData = []

    if (coinList.length) {
      coinList.forEach(data => {
        if (data.isout == 'enable') {
          coinListCopy.push(data)
          if (!coinNameArr.includes(data.coin)) {
            coinNameArr.push(data.coin)
          }
        }
      })

      coinNameArr.forEach(key => {
        const coinData = { name: key, coinArr: [] }
        coinListCopy.forEach(data => {
          if (data.coin == key) {
            coinData.coinArr.push(Object.assign({}, data))
          }
        })

        resCoinData.push(coinData)
      })

      return resCoinData
    }
  },

  rechargeCoinList(state) {
    const coinList = state.wallet.rechargeCoinArr
    const coinListCopy = []
    const coinNameArr = []
    const resCoinData = []

    if (coinList.length) {
      coinList.forEach(data => {
        if (data.isin == 'enable') {
          coinListCopy.push(data)
          if (!coinNameArr.includes(data.coin)) {
            coinNameArr.push(data.coin)
          }
        }
      })

      coinNameArr.forEach(key => {
        const coinData = { name: key, coinArr: [] }
        coinListCopy.forEach(data => {
          if (data.coin == key) {
            coinData.coinArr.push(Object.assign({}, data))
          }
        })

        resCoinData.push(coinData)
      })

      return resCoinData
    }
  }
}
export default getters
