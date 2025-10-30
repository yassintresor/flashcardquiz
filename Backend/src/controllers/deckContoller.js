import {
  getAllDecks as fetchAllDecks,
  getDeckById as fetchDeckById,
  createDeck as addDeck,
  updateDeck as modifyDeck,
  deleteDeck as removeDeck,
} from "../models/deckModel.js";


export const getAllDecks = async (req, res) => {
  try {
    const decks = await fetchAllDecks();
    res.json(decks);
  } catch (error) {
    console.error("Error fetching decks:", error);
    res.status(500).json({ message: "Error fetching decks" });
  }
};


export const getDeckById = async (req, res) => {
  try {
    const id = req.params.id;
    const deck = await fetchDeckById(id);

    if (!deck) return res.status(404).json({ message: "Deck not found" });

    res.json(deck);
  } catch (error) {
    console.error("Error fetching deck:", error);
    res.status(500).json({ message: "Error fetching deck" });
  }
};


export const createDeck = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const deckId = await addDeck({ name, description, category });
    res.status(201).json({ message: "Deck created successfully", deckId });
  } catch (error) {
    console.error("Error creating deck:", error);
    res.status(500).json({ message: "Error creating deck" });
  }
};


export const updateDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    const existingDeck = await fetchDeckById(id);
    if (!existingDeck) return res.status(404).json({ message: "Deck not found" });

    await modifyDeck(id, { name, description, category });
    res.json({ message: "Deck updated successfully" });
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({ message: "Error updating deck" });
  }
};


export const deleteDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const existingDeck = await fetchDeckById(id);

    if (!existingDeck) return res.status(404).json({ message: "Deck not found" });

    await removeDeck(id);
    res.json({ message: "Deck deleted successfully" });
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({ message: "Error deleting deck" });
  }
};
