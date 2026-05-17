const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const AlizePropertyFraction = await hre.ethers.getContractFactory("AlizePropertyFraction");
  const propertyToken = await AlizePropertyFraction.deploy();

  // Wait for deployment to finish
  await propertyToken.waitForDeployment();

  const address = await propertyToken.getAddress();
  console.log("AlizePropertyFraction deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
