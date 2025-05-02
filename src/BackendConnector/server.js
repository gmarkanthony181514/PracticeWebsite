import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.post("/api/createuser", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "  ⚠️ Username and Password is required! Try again..." });
    }

    res.status(201).json({ message: " 🎉 User registered successfully" });
});

const PORT = 83;
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.100.200:${PORT}`);
});


