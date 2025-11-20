// oilChangeEstimator.js

const readline = require("readline");

// Default oil change intervals
const oilIntervals = {
  synthetic: { miles: 10000, months: 12 },
  blend: { miles: 7500, months: 9 },
  conventional: { miles: 5000, months: 6 }
};

function estimateNextOilChange({ make, model, year, oilType, currentMileage, lastOilChangeMileage, lastOilChangeDate }) {
  const interval = oilIntervals[oilType.toLowerCase()];
  if (!interval) {
    throw new Error("Unknown oil type. Please choose synthetic, blend, or conventional.");
  }

  const nextMileage = lastOilChangeMileage + interval.miles;

  const lastDate = new Date(lastOilChangeDate);
  const nextDate = new Date(lastDate);
  nextDate.setMonth(nextDate.getMonth() + interval.months);

  return {
    make,
    model,
    year,
    oilType,
    nextMileage,
    nextDate: nextDate.toDateString()
  };
}

// CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🚗 Oil Change Estimation Engine 🚗");

rl.question("Enter vehicle make: ", (make) => {
  rl.question("Enter vehicle model: ", (model) => {
    rl.question("Enter vehicle year: ", (year) => {
      rl.question("Enter oil type (synthetic/blend/conventional): ", (oilType) => {
        rl.question("Enter current mileage: ", (currentMileage) => {
          rl.question("Enter last oil change mileage: ", (lastMileage) => {
            rl.question("Enter last oil change date (YYYY-MM-DD): ", (lastDate) => {
              try {
                const result = estimateNextOilChange({
                  make,
                  model,
                  year,
                  oilType,
                  currentMileage: parseInt(currentMileage),
                  lastOilChangeMileage: parseInt(lastMileage),
                  lastOilChangeDate: lastDate
                });

                console.log("\n✅ Oil Change Estimate:");
                console.log(`Vehicle: ${result.year} ${result.make} ${result.model}`);
                console.log(`Oil Type: ${result.oilType}`);
                console.log(`Next Oil Change Mileage: ${result.nextMileage}`);
                console.log(`Next Oil Change Date: ${result.nextDate}`);

              } catch (err) {
                console.error("Error:", err.message);
              }
              rl.close();
            });
          });
        });
      });
    });
  });
});
