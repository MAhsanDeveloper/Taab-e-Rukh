import mongoose from "mongoose";

const spotlightSchema = new mongoose.Schema(
  {
    categories: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 3; // max 3 spotlight categories
        },
        message: "You can select up to 3 spotlight categories only.",
      },
    },
  },
  { timestamps: true }
);

const Spotlight = mongoose.model("Spotlight", spotlightSchema);

export default Spotlight;
