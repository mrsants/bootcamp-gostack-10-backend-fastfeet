import App from "./src/App";

App.server.listen(process.env.APP_PORT, () => {
  console.log(`Server running inenv.APP_PORT ${process.env.APP_PORT}`);
});
