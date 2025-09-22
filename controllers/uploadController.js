import crypto from "crypto";
import { Readable } from "stream";
import pinata from "../config/pinata.js";
import Claim from "../models/Claim.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = await Promise.all(
      req.files.map(async (file) => {
        // 1. Fetch Cloudinary file as buffer
        const response = await fetch(file.path);
        if (!response.ok) throw new Error(`Failed to fetch Cloudinary file: ${response.statusText}`);
        const buffer = Buffer.from(await response.arrayBuffer());

        // 2. Convert buffer → stream for Pinata
        const stream = Readable.from(buffer);

        // 3. Upload to Pinata
        const pinataRes = await pinata.pinFileToIPFS(stream, {
          pinataMetadata: { name: file.originalname },
          pinataOptions: { cidVersion: 0 },
        });
        const ipfsCid = pinataRes.IpfsHash;

        // 4. Hash file
        const evidenceHash = crypto.createHash("sha256").update(buffer).digest("hex");

        // 5. Save in MongoDB
        const claim = await Claim.create({
          cloudinaryUrl: file.path,
          ipfsCid,
          evidenceHash,
        });

        return claim;
      })
    );

    res.status(200).json({
      message: "Images uploaded, pinned to Pinata, and stored in DB successfully",
      claims: results,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
