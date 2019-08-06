exports.getRandomCode = () => {
  let code = 0
  while(code < 1000) {
    code = Math.floor(Math.random() * 10000)
  }

  return code
}