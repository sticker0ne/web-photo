/*
      ВАЖНО!!!
      Данный конфиг не работает никак. Он нужен только для того, чтобы webstorm понимал vue import @
 */

module.exports = {
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname) // change this to your folder path
    }
  }
}
