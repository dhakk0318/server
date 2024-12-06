const express = require("express");
const {
  createOffer,
  getOffers,
  getOfferByCode,
  updateOffer,
  deleteOffer,
} = require("../../Controllers/AdminOfferController/OfferController"); // Ensure this path is correct

const router = express.Router();

// Define routes
router.post("/", createOffer);
router.get("/", getOffers);
router.get("/:offercode", getOfferByCode);
router.put("/:offercode", updateOffer);
router.delete("/:offercode", deleteOffer);

module.exports = router;
