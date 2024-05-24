
const requireAuth= require("../middleware/requireauth.js");
const router = express.Router()

//require auth for all classes routes
router.use(requireAuth)