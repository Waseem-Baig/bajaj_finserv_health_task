const express = require("express");
const app = express();

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Replace these with your actual details before submission
const FULL_NAME = "john_doe"; // lowercase, e.g. 'john_doe'
const DOB = "17091999"; // ddmmyyyy
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

function processData(data) {
  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0;
  let alpha_concat = "";

  data.forEach((item) => {
    if (/^\d+$/.test(item)) {
      // Numbers only
      const num = parseInt(item, 10);
      if (num % 2 === 0) {
        even_numbers.push(item);
      } else {
        odd_numbers.push(item);
      }
      sum += num;
    } else if (/^[a-zA-Z]+$/.test(item)) {
      // Alphabets only
      alphabets.push(item.toUpperCase());
      alpha_concat += item;
    } else if (/^[a-zA-Z]+\d+$/.test(item)) {
      // Alphanumeric (e.g. roll numbers)
      special_characters.push(item);
    } else if (/[^a-zA-Z0-9]/.test(item)) {
      // Special characters
      special_characters.push(item);
    }
  });

  // Build concat_string: reverse, alternating caps
  let reversed = alpha_concat.split("").reverse();
  let concat_string = "";
  reversed.forEach((ch, i) => {
    concat_string += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
  });

  return {
    is_success: true,
    user_id: `${FULL_NAME}_${DOB}`,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: sum.toString(),
    concat_string,
  };
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ is_success: false, message: "Invalid input" });
    }
    const response = processData(data);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ is_success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
