import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let vehicles = [];

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

async function main() {
  console.log("🚗 Vehicle Tracker Application 🚗");

  let addMore = "y";
  while (addMore.toLowerCase() === "y") {
    const id = await ask("Vehicle ID: ");
    const owner = await ask("Owner: ");
    const make = await ask("Make: ");
    const model = await ask("Model: ");
    const year = await ask("Year: ");
    const mileage = await ask("Mileage: ");
    const licensePlate = await ask("License Plate: ");

    // 🔹 Ask if electric
    const electricInput = await ask("Is the vehicle electric? (y/n): ");
    const isElectric = electricInput.trim().toLowerCase() === "y";

    // Only ask oil questions if NOT electric
    let oilType = null;
    let oilCapacity = null;
    let lastOilChange = null;
    if (!isElectric) {
      oilType = await ask("Oil Type: ");
      oilCapacity = await ask("Oil Capacity (quarts): ");
      lastOilChange = await ask("Last Oil Change Date (YYYY-MM-DD): ");
    }

    const lastTireRotation = await ask("Last Tire Rotation Date (YYYY-MM-DD): ");

    vehicles.push({
      id,
      owner,
      make,
      model,
      year,
      mileage,
      licensePlate,
      isElectric,
      oilType,
      oilCapacity,
      lastOilChange,
      lastTireRotation
    });

    addMore = await ask("Add another vehicle? (y/n): ");
  }

  console.log("\n📋 Vehicle List:");
  console.table(vehicles);

  rl.close();
}

main();
