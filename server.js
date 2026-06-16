require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));

// ================= CONEXIÓN =================

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("✅ Conectado a MongoDB");

})

.catch((err) => {

    console.log(err);

});

// ================= ESQUEMA =================

const animalSchema = new mongoose.Schema({

    nombre: String,

    especie: String,

    raza: String,

    edad: Number,

    descripcion: String,

    imagen: String

});

const Animal = mongoose.model("Animal", animalSchema);

// ================= OBTENER =================

app.get("/animales", async (req, res) => {

    try {

        const animales = await Animal.find().sort({ _id: -1 });

        res.json(animales);

    }

    catch (error) {

        res.status(500).json({

            mensaje: "Error al obtener animales"

        });

    }

});

// ================= AGREGAR =================

app.post("/animales", async (req, res) => {

    try {

        const nuevoAnimal = new Animal({

            nombre: req.body.nombre,

            especie: req.body.especie,

            raza: req.body.raza,

            edad: req.body.edad,

            descripcion: req.body.descripcion,

            imagen: req.body.imagen

        });

        await nuevoAnimal.save();

        res.json({

            mensaje: "Animal agregado"

        });

    }

    catch (error) {

        res.status(500).json({

            mensaje: "Error al agregar"

        });

    }

});

// ================= EDITAR =================

app.put("/animales/:id", async (req, res) => {

    try {

        await Animal.findByIdAndUpdate(

            req.params.id,

            req.body

        );

        res.json({

            mensaje: "Animal actualizado"

        });

    }

    catch (error) {

        res.status(500).json({

            mensaje: "Error al actualizar"

        });

    }

});

// ================= ELIMINAR =================

app.delete("/animales/:id", async (req, res) => {

    try {

        await Animal.findByIdAndDelete(

            req.params.id

        );

        res.json({

            mensaje: "Animal eliminado"

        });

    }

    catch (error) {

        res.status(500).json({

            mensaje: "Error al eliminar"

        });

    }

});

// ================= INICIO =================

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});

// ================= PUERTO =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Servidor en puerto ${PORT}`);

});