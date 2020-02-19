import App from "./src/App";

App.listen(process.env.APP_PORT, () => {
  console.log(`Server running ${process.env.APP_PORT}`);
});
