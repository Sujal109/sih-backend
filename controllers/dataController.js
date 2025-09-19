import UserData from "../models/dataModel.js";

// Create a new flexible dataset
export const createData = async (req, res) => {
  try {
    const { walletAddress, ...data } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "walletAddress is required" });
    }

    const newData = await UserData.create({
      user: req.user.id,
      walletAddress,
      data
    });

    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all datasets of logged-in user
export const getAllData = async (req, res) => {
  try {
    const allData = await UserData.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single dataset by ID
export const getDataById = async (req, res) => {
  try {
    const dataItem = await UserData.findOne({ _id: req.params.id, user: req.user.id });
    if (!dataItem) return res.status(404).json({ message: "Data not found" });
    res.json(dataItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


