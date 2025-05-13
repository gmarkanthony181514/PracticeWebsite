import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

//RicoAPI Backend Create user
app.post("/api/Createuser", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || !confirmPassword || !email ) {
        return res.status(400).json({ message: "  ⚠️ All Fields are required" });
    }

    res.status(201).json({ message: " 🎉 User registered successfully" });
});

const PORT = 50619;
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.100.225:${PORT}`);
});


