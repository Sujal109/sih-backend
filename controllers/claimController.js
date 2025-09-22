import crypto from "crypto";
import { Readable } from "stream";
import pinata from "../config/pinata.js";
import Claim from "../models/Claim.js";

/**
 * Create claim(s) → upload files → hash → pin to Pinata → store in MongoDB
 */
export const createClaim = async (req, res) => {
  try {
    // ✅ Correct files check
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { longitude, latitude, siteId, city, walletAddress, credits } = req.body;
    if (!longitude || !latitude || !siteId || !city || !walletAddress || !credits) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const claims = await Promise.all(
      req.files.map(async (file) => {
        if (!file.path) throw new Error("Cloudinary file path is missing");

        const response = await fetch(file.path);
        if (!response.ok) throw new Error(`Failed to fetch Cloudinary file: ${response.statusText}`);
        const buffer = Buffer.from(await response.arrayBuffer());

        const stream = Readable.from(buffer);

        const pinataRes = await pinata.pinFileToIPFS(stream, {
          pinataMetadata: { name: file.originalname },
          pinataOptions: { cidVersion: 1 },
        });

        const evidenceHash = crypto.createHash("sha256").update(buffer).digest("hex");

        const claim = await Claim.create({
          longitude,
          latitude,
          siteId,
          city,
          walletAddress,
          credits,
          cloudinaryUrl: file.path,
          ipfsCid: pinataRes.IpfsHash,
          evidenceHash,
          status: "pending",
        });

        return claim;
      })
    );

    res.status(200).json({
      message: "Claim(s) created successfully",
      claims,
    });
  } catch (err) {
    console.error("Create claim error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

/**
 * Approve a claim (called by regulator backend)
 */
export const approveClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { txHash, useEvidenceHash = false } = req.body;

    if (!txHash) return res.status(400).json({ message: "txHash is required" });

    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "approved";
    claim.txHash = txHash;
    claim.onchainEvidence = useEvidenceHash ? claim.evidenceHash : claim.ipfsCid;

    await claim.save();

    res.status(200).json({
      message: "Claim approved successfully",
      claim,
    });
  } catch (err) {
    console.error("Approve claim error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Reject a claim
 */
export const rejectClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "rejected";
    await claim.save();

    res.status(200).json({
      message: "Claim rejected successfully",
      claim,
    });
  } catch (err) {
    console.error("Reject claim error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all claims
 */
export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.status(200).json(claims);
  } catch (err) {
    console.error("Get claims error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a single claim by ID
 */
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    res.status(200).json(claim);
  } catch (err) {
    console.error("Get claim error:", err);
    res.status(500).json({ error: err.message });
  }
};
