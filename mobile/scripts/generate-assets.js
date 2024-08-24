const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const Color = require("color");
const { argv } = require("process");

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

// Get colors from environment variables
let color1;
let color2;

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
  if (argv.length < 3) {
    throw new Error("Please provide a team slug");
  }
  const BASE_URL = `http://localhost:3000/api/team/${argv[2]}`;
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // Download image from server and save it to the local file system in the "inputFile" path
  const IMAGE_URL = data.image;
  const imageResponse = await fetch(IMAGE_URL);
  if (!imageResponse.ok) {
    throw new Error(`HTTP error! status: ${imageResponse.status}`);
  }
  const svgPath = inputFile.replace(".png", ".svg");

  // Save the image to the local file system
  const imageBuffer = await imageResponse.arrayBuffer();
  await fs.writeFile(svgPath, Buffer.from(imageBuffer));

  // Use sharp to convert the SVG to PNG with  width: 1024 and height: 1024,
  // Contain the original image, do not "cover" it
  // then save the PNG to the "inputFile" path
  await sharp(svgPath)
    .resize(1024, 1024, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFile(inputFile);

  // Delete the unneeded SVG file
  await fs.unlink(svgPath);

  color1 = data.primaryColor;
  color2 = data.secondaryColor;

  // Change colors in app.json
  const appJson = await fs.readFile(appJsonPath, "utf8");
  const appJsonData = JSON.parse(appJson);
  appJsonData.expo.extra.team = data;
  await fs.writeFile(appJsonPath, JSON.stringify(appJsonData, null, 2));

  return data;
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

// Function to create an image with an SVG gradient background and centered logo
async function createImage(outputPath, outputWidth, outputHeight, logoScale) {
  try {
    // Read and customize the SVG gradient template
    const svgData = await fs.readFile(gradientTemplateFile, "utf8");
    const customizedSvg = svgData
      .replace(/{{COLOR1}}/g, Color(color1).mix(Color("#454545"), 0.5).hex())
      .replace(/{{COLOR2}}/g, Color(color2).mix(Color("#212121"), 0.5).hex());

    // Create the gradient background
    const gradientBuffer = Buffer.from(customizedSvg);

    const metadata = await sharp(inputFile).metadata();
    const logoWidth = outputWidth * logoScale;
    const logoHeight = (metadata.height / metadata.width) * logoWidth;
    const logoBuffer = await sharp(inputFile)
      .resize({
        width: Math.round(logoWidth),
        height: Math.round(logoHeight),
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    // Create the gradient background and composite the logo on top
    await sharp(gradientBuffer)
      .resize(outputWidth, outputHeight) // Ensure the SVG is resized to match output dimensions
      .composite([{ input: logoBuffer, gravity: "center" }])
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
