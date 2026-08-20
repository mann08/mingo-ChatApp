import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/mingo_chatapp";
  console.log(`⏳ Connecting to MongoDB at ${uri}...`);
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} — DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If localhost failed, attempt fallback to 127.0.0.1
    if (uri.includes("localhost")) {
      const fallbackUri = uri.replace("localhost", "127.0.0.1");
      console.log(`🔄 Retrying with IPv4 fallback: ${fallbackUri}...`);
      try {
        const conn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected via IPv4: ${conn.connection.host} — DB: ${conn.connection.name}`);
        return conn;
      } catch (retryErr) {
        console.error(`❌ Fallback MongoDB Connection Error: ${retryErr.message}`);
      }
    }
  }
};

export default connectDB;
