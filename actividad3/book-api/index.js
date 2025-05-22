require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

let adminConfig;

if (process.env.NODE_ENV === "production") {
  // 🔒 Usar credencial por defecto de Cloud Run
  adminConfig = {
    credential: admin.credential.applicationDefault(),
  };
  console.log("☁️ Usando credencial por defecto (Cloud Run)");
} else {
  require("dotenv").config(); // Solo en desarrollo
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_DATABASE_URL) {
    console.error("Faltan variables de entorno requeridas");
    process.exit(1);
  }

  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  adminConfig = {
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL
  };
  console.log("🗝️ Usando clave de servicio local");
}

try {
  if (!admin.apps.length) {
    admin.initializeApp(adminConfig);
    console.log("✅ Firebase inicializado");
  }
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
  process.exit(1);
}

const db = admin.firestore();
console.log("✅ Firestore inicializado");

// Configurar Firestore
db.settings({
  ignoreUndefinedProperties: true,
  timestampsInSnapshots: true
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const booksRef = db.collection("books");

// 📚 Listar libros
app.get("/books", async (req, res) => {
    try {
        console.log("Intentando obtener libros...");
        const snapshot = await booksRef.get();
        const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`✅ Libros obtenidos: ${books.length}`);
        res.json(books);
    } catch (error) {
        console.error("Error al listar libros:", error);
        res.status(500).json({ error: "Error al obtener los libros", details: error.message });
    }
});

// ➕ Crear libro
app.post("/books", async (req, res) => {
    try {
        console.log("Intentando crear libro con datos:", req.body);
        const data = {
            title: req.body.title,
            author: req.body.author,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        console.log("Datos procesados:", data);
        const ref = await booksRef.add(data);
        console.log("✅ Libro creado con ID:", ref.id);
        res.json({ id: ref.id });
    } catch (error) {
        console.error("Error al crear libro:", error);
        res.status(500).json({ 
            error: "Error al crear el libro", 
            details: error.message,
            code: error.code
        });
    }
});

// 🛠️ Actualizar libro
app.put("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const docRef = booksRef.doc(id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }
        
        await docRef.set(req.body, { merge: true });
        res.sendStatus(200);
    } catch (error) {
        console.error("Error al actualizar libro:", error);
        res.status(500).json({ error: "Error al actualizar el libro" });
    }
});

// ❌ Eliminar libro
app.delete("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const docRef = booksRef.doc(id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }
        
        await docRef.delete();
        res.sendStatus(200);
    } catch (error) {
        console.error("Error al eliminar libro:", error);
        res.status(500).json({ error: "Error al eliminar el libro" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
