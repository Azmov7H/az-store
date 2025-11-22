import helmet from "helmet";
import Cors from "cors";

// Helmet middleware
export const applyHelmet = (req, res) => {
  helmet()(req, res, () => {});
};

// CORS middleware
export const cors = Cors({
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  origin: "*", // يمكنك تحديد دومين
});
