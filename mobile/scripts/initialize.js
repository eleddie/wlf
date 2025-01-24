const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const Color = require("color");
const { argv } = require("process");
const { execSync } = require("child_process");

const PRIMARY_COLOR = "#444";
const SECONDARY_COLOR = "#222";

// Input image (your PNG logo file)
const inputFile = path.join(__dirname, "../assets/images/logo.png");

// Output paths
const outputIcon = path.join(__dirname, "../assets/images/icon.png");
const outputSplash = path.join(__dirname, "../assets/images/splash.png");

// SVG gradient template path
const gradientTemplateFile = path.join(
  __dirname,
  "../assets/images/gradient.svg"
);

const appJsonPath = path.join(__dirname, "../app.json");
const easJsonPath = path.join(__dirname, "../eas.json");

// Get colors from environment variables
let primaryColor = PRIMARY_COLOR;
let secondaryColor = SECONDARY_COLOR;

// Target dimensions and scales
const assets = [
  {
    outputPath: outputIcon,
    width: 1024,
    height: 1024,
    logoScale: 0.9,
  },
  {
    outputPath: outputSplash,
    width: 1284,
    height: 2778,
    logoScale: 0.4,
  },
];

// Get logo and colors from server
async function getTeamData() {
  if (argv[2] === "wlf") {
    console.log("No team specified, using generic assets");
    execSync("cp -r assets/images/generic/. assets/images/");
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
    delete appJson.expo.extra.team;
    appJson.expo.ios.bundleIdentifier = "com.wlf.app";
    appJson.expo.android.package = "com.wlf.app";
    appJson.expo.name = "WLF";
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

    const easJson = JSON.parse(fs.readFileSync(easJsonPath, "utf8"));
    easJson.build.production.channel = "production";
    fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2));

    return;
  }

  const BASE_URL = `http://localhost:3000/api/team/${argv[2]}`;
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const teamData = await response.json();
  // Download image from server and save it to the local file system in the "inputFile" path
  const IMAGE_URL = teamData.image;
  const imageResponse = await fetch(IMAGE_URL);
  if (!imageResponse.ok) {
    throw new Error(`HTTP error! status: ${imageResponse.status}`);
  }
  const svgPath = inputFile.replace(".png", ".svg");

  // Save the image to the local file system
  const imageBuffer = await imageResponse.arrayBuffer();
  fs.writeFileSync(svgPath, Buffer.from(imageBuffer));

  // Use sharp to convert the SVG to PNG with  width: 1024 and height: 1024,
  // Contain the original image, do not "cover" it
  // then save the PNG to the "inputFile" path

  const config = {
    width: 1024,
    height: 1024,
    fit: "contain",
    background: "transparent",
  };
  await sharp(svgPath).resize(config).toFile(inputFile);

  // Delete the unneeded SVG file
  fs.unlinkSync(svgPath);

  primaryColor = teamData.primaryColor;
  secondaryColor = teamData.secondaryColor;

  // Change colors in app.json
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
  appJson.expo.extra.team = teamData;
  const bundle = `com.wlf.${teamData.slug.replace(/-/g, "")}`;
  appJson.expo.ios.bundleIdentifier = bundle;
  appJson.expo.android.package = bundle;
  appJson.expo.name = teamData.name;
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

  const easJson = JSON.parse(fs.readFileSync(easJsonPath, "utf8"));
  easJson.build.production.channel = `production-${teamData.slug.replace(
    /-/g,
    ""
  )}`;
  fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2));

  return teamData;
}

// Generate assets
async function generateAssets() {
  for (const asset of assets) {
    await createImage(
      asset.outputPath,
      asset.width,
      asset.height,
      asset.logoScale
    );
  }
}

const mix = (color1, color2) => {
  return Color(color1).mix(Color(color2), 0.5).hex();
};

const replaceColors = (str, color1, color2) => {
  return str
    .replace(PRIMARY_COLOR, mix(color1, PRIMARY_COLOR))
    .replace(SECONDARY_COLOR, mix(color2, SECONDARY_COLOR));
};

// Function to create an image with an SVG gradient background and centered logo
async function createImage(outputPath, outputWidth, outputHeight, logoScale) {
  try {
    // Read and customize the SVG gradient template
    const svgData = fs.readFileSync(gradientTemplateFile, "utf8");
    const customizedSvg = replaceColors(svgData, primaryColor, secondaryColor);

    const meta = await sharp(inputFile).metadata();
    const width = (outputWidth * logoScale) | 0;
    const height = ((meta.height / meta.width) * width) | 0;

    const logoBuffer = await sharp(inputFile).resize(width, height).toBuffer();

    const gradientBuffer = Buffer.from(customizedSvg);
    await sharp(gradientBuffer)
      .resize(outputWidth, outputHeight)
      .composite([{ input: logoBuffer }])
      .toFile(outputPath);

    console.log(`Image generated: ${outputPath}`);
  } catch (err) {
    console.error(`Error generating image: ${outputPath}`, err);
  }
}

async function main() {
  await getTeamData();
  await generateAssets();
}

main();
