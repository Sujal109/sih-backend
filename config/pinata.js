import pinataSDK from "@pinata/sdk";
import dotenv from "dotenv";
dotenv.config();
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export default pinata;
