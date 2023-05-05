import mongoose from "mongoose";

function connect() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/soialNetworking")
    .then(() => console.log("Connect successfully!"))
    .catch((error) => console.log("Connect failure!"));
}
export default connect;
