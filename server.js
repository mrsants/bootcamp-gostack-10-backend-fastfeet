import App from "./src/App";

App.server.listen(process.env.APP_PORT, () => {
  console.log(`Server running ${process.env.APP_PORT}`);
});
