window.appVersion = '1.0'
function loadApp() {
  if (window.mui) {
    // app环境 等待plus
    const appInterval = setInterval(() => {
      if (window.plus) {
        window.clearInterval(appInterval)
        require('./App.js')
      }
    }, 500)
  } else {
    require('./App.js')
  }
}

loadApp()
