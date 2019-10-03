import App from "./app";
import AuthController from "./controllers/auth-controller";
import ProfileController from "./controllers/profile-controller";

const app = new App(
    [
        new AuthController(),
        new ProfileController
    ]
);

app.listen();

