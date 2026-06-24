import app from "./app";

const port = process.env.PORT || 5000;
async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
    process.exit(1);
  }
}
main();
