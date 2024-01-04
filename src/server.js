import express from "express";
import RouterWeb from "./Routers/RouterWeb.js";
import MiddeleWareConfig from "./Configs/ConfigMiddelware.js";

const StartServer = () => {
    try {
        const app = express();
        const PORT = 8000;

        MiddeleWareConfig(app);
        RouterWeb(app);//File chua tat ca cac khai bao route

        app.use((req, res) => {
            return res.status(404).json({
                statusCode: 404,
                message: "NotFound",
                data: []
            });
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}.`);
        });
    } catch (exception) {
        console.log(exception);
    }
}


StartServer();