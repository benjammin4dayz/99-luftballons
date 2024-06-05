import {
  arrayToJavascriptFile,
  generateRandomCities,
  printArrayLineByLine,
} from "./util.js";

// get a block of 100 random cities that are completely random and unique
const cityList = generateRandomCities();

switch (process.argv[2]) {
  case "--generate":
    arrayToJavascriptFile(cityList, "deStädte");
    break;
  case "--print":
    console.log(cityList);
    break;
  case "--println":
    printArrayLineByLine(cityList);
    break;
  default:
    console.log("Usage: npm run <generate|print|println>");
    break;
}
