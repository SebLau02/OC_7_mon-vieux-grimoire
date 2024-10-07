const mongoose = require("mongoose");

const dropDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://OCR_P7:dSiBGFPe1bhVNMGY@cluster0.je84pvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {}
    );

    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log("Base de données supprimée avec succès!");
    } else {
      console.error("La connexion à la base de données n'est pas établie.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la base de données :",
      error
    );
  } finally {
    await mongoose.disconnect();
  }
};

dropDatabase();

// run node dropDb.js in terminal at src
