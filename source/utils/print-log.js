const printLog = (text = '', state = 'n') => {
  const s = {
    y: '✅',
    n: '☑️',
    x: '❌'
  }

  console.log((s[state] || null), ' ', text)
}

module.exports = printLog
