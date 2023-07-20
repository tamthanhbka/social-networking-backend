import mongoose from "mongoose";

function connect() {
  mongoose
    .connect(
      process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/socialNetworking"
    )
    .then(() => console.log("Connect successfully!"))
    .catch((error) => console.log("Connect failure!"));
}
export default connect;
