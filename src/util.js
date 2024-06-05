import germanMetadata from "german-metadata";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

// import.meta.dirname works only in VERY NEW versions of node (20.11 / 21.2)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create a JavaScript file containing the provided array as an exported member
 *
 * @param {Array} arr
 * @param {String} varName - The name of the variable representing the generated array
 */
function arrayToJavascriptFile(arr, varName) {
  let string = `export const ${varName} = [`;
  for (let i = 0; i < arr.length; i++) {
    string += `"` + arr[i] + `", `;
  }
  string += "]";
  fs.writeFileSync(path.join(__dirname, "../", varName + ".js"), string);
  console.log(`Created ${varName}.js`);
}

/**
 * The key thing to note is that the array returned from this function is guaranteed to:
 * A. contain different values each time the function is called
 * B. always order cities randomly within the list
 * C. never repeat a city within the same "block" of returned cities
 *
 * @param {Number} numberOfCities How many city names to block together
 * @returns {Array} An array of randomly selected/ordered cities
 */
function generateRandomCities(numberOfCities = 99) {
  const allCities = germanMetadata.ALL_CITY_NAMES;
  const pickedCities = new Set();

  for (let i = 0; i < numberOfCities; i++) {
    // pick a random number from 0 to the maximum amount of cities
    const randomIndex = Math.floor(Math.random() * allCities.length);
    // use the random number to select an index within the array of cities
    const pickedCity = allCities[randomIndex];
    if (!pickedCities.has(pickedCity)) {
      // if the set did not have this city, add it
      pickedCities.add(pickedCity);
    } else {
      // otherwise, redo this iteration later
      i--;
    }
  }

  // spread the set into an array
  return [...pickedCities];
}

/**
 *  Prints each line of an array, requiring the user to press a button before continuing
 *
 * @param {Array} arr
 */
function printArrayLineByLine(arr) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let currentIndex = 0;
  function displayNextLine() {
    if (currentIndex < arr.length) {
      const line = `The current selection is \x1b[32m${
        arr[currentIndex]
      }\x1b[0m. There are \x1b[31m${
        arr.length - currentIndex - 1
      }\x1b[0m selections remaining.`;
      rl.question(line, (answer) => {
        currentIndex++;
        displayNextLine();
      });
    } else {
      rl.close();
    }
  }

  displayNextLine();
}

export { arrayToJavascriptFile, generateRandomCities, printArrayLineByLine };
