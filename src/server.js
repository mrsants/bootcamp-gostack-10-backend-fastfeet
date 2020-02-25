import App from './app';

App.listen(process.env.APP_PORT, () => {
  console.log(`Server running ${process.env.APP_PORT}`);
});
