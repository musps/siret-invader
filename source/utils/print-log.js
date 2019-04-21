const printLog = (text = '', state = false) => {
  const y = '✅'
  const n = '☑️'

  console.log((state ? y : n), ' ', text)
}

module.exports = printLog
