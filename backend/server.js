import dotenv from "dotenv";
dotenv.config(); // must be first
import app from "./app.js";
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
