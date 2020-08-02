// TODO: realise how to call from "NODE_PATH=.", F.I: import loadApp from 'src/loader';
import loadApp from './src/loader';

loadApp()
    .then(() => console.log('application loaded'))
    .catch((error) => {
        console.error('apllication cannot be loaded', error.stack);
        process.exit(1);
    });
