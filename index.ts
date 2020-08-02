// TODO: realise how to call from "NODE_PATH=.", F.I: import loadApp from 'src/loader';
// TODO: realise whats is this error into tsconfig.json: No inputs were found in config file
import loadApp from './src/loader';

loadApp()
    .then(() => console.log('application loaded'))
    .catch((error) => {
        console.error('apllication cannot be loaded', error.stack);
        process.exit(1);
    });
