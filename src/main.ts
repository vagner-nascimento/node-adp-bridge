import loadApp from "./loader"

loadApp()
  .then(() => console.log("application loaded"))
  .catch(err => {
    console.log("exiting application with error ", err)
    process.exit(1)
  })
