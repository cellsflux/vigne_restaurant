import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    //mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

const filePath = path.join(__dirname, "data/data.db");

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
ipcMain.on("config", async (event, arg) => {
  const data = fs.readFileSync(filePath);

  event.reply("config", JSON.parse(data));
});

ipcMain.on("savefood_Product", async (event, arg) => {
  // Charger le fichier JSON
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier JSON :", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const newData = arg;
      jsonData.cluster.documents.products_restaurant.push(newData);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          event.reply("savefood_Product", {
            error: true,
            message: "error lors de l'ajout du produits",
          });
          return;
        }
        const data = fs.readFileSync(filePath);
        event.reply("savefood_Product", {
          message: "success",
          data: JSON.parse(data),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse du fichier JSON :", error);
    }
  });
});

///AD CATEGORIE

ipcMain.on("addcategorieFood", (event, arg) => {
  // Charger le fichier JSON
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier JSON :", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const newData = arg;
      jsonData.cluster.documents.category_product_restau.push(newData);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          event.reply("addcategorieFood", {
            error: true,
            message: "error lors de l'ajout de la categorie",
          });
          return;
        }
        const data = fs.readFileSync(filePath);
        event.reply("addcategorieFood", {
          message: "success",
          data: JSON.parse(data),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse du fichier JSON :", error);
    }
  });
});

ipcMain.on("update_product_restau", (event, arg) => {
  // Charger le fichier JSON
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier JSON :", err);
      event.reply("update_product_restau", { message: "error" });
      return;
    }

    try {
      let jsonData = JSON.parse(data);
      // Parcourir les deux tableaux simultanément pour mettre à jour la quantité
      /*const index = jsonData.cluster.documents.products_restaurant.findIndex(
        (item) => item.name === arg.name
      );*/

      jsonData.cluster.documents.products_restaurant = arg;
      console.log(arg);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du fichier JSON :", err);
          event.reply("update_product_restau", { message: "error" });
          return;
        }

        const data = fs.readFileSync(filePath);
        event.reply("update_product_restau", {
          message: "success",
          data: JSON.parse(data),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse du fichier JSON :", error);
      event.reply("update_product_restau", { message: "error" });
    }
  });
});

//GENERATE FACTURE
ipcMain.on("generate_facture_restaurant", (event, arg) => {
  // Charger le fichier JSON
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier JSON :", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const newData = arg;
      jsonData.cluster.documents.facture_restaurant.push(newData);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          event.reply("generate_facture_restaurant", {
            error: true,
            message: "error lors de l'ajout de la categorie",
          });
          return;
        }
        const data = fs.readFileSync(filePath);
        event.reply("generate_facture_restaurant", {
          message: "Données ajoutées avec succès !",
          data: JSON.parse(data),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse du fichier JSON :", error);
    }
  });
});

//ADD DEPENSES
ipcMain.on("addDepense", async (event, arg) => {
  // Charger le fichier JSON
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier JSON :", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const newData = arg;
      jsonData.cluster.documents.depenses.push(newData);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          event.reply("addDepense", {
            error: true,
            message: "error lors de l'ajout de depense",
          });
          return;
        }
        const data = fs.readFileSync(filePath);
        event.reply("addDepense", {
          message: "success add depense",
          data: JSON.parse(data),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse du fichier JSON :", error);
    }
  });
});
