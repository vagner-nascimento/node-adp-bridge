import loadApp from "./loader/Loader"

loadApp()  
  .catch(err => {
    console.log("exiting application with error ", err)
    process.exit(1)
  })