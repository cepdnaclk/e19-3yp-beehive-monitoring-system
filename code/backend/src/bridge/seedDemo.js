/*
Creates the demo user and a small apiary of beehives, then prints their ids.

The Pi (or the simulator) has to publish a beehive_id that already exists in
Mongo, because BeehiveMetrics.beehive_id is a ref to Beehive. Run this once on
a fresh database, then feed the ids to `npm run simulate` or copy one into
credentials_and_beehive_id.txt on the Pi.

Safe to re-run: existing users and hives are left alone.

Usage: npm run seed
*/

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { Beehive } from "../models/beehiveModel.js";

dotenv.config();

const DEMO_EMAIL = "demo@beezee.lk";
const DEMO_PASSWORD = "demo1234";
const DEMO_USERNAME = "demo";

// "Demo Hive" stays first so ids handed out by earlier runs keep working.
const DEMO_HIVES = [
  { name: "Demo Hive", location: "Peradeniya" },
  { name: "Hive Alpha", location: "Gannoruwa" },
  { name: "Hive Beta", location: "Hantana" },
  { name: "Hive Gamma", location: "Galaha" },
  { name: "Hive Delta", location: "Digana" },
  { name: "Hive Epsilon", location: "Doluwa" },
];

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING2);

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = await User.create({
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      password: await bcrypt.hash(DEMO_PASSWORD, 10),
    });
    console.log(`Created user ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    console.log(`User ${DEMO_EMAIL} already exists`);
  }

  const hives = [];
  for (const spec of DEMO_HIVES) {
    let beehive = await Beehive.findOne({ user_id: user._id, name: spec.name });
    if (!beehive) {
      beehive = await Beehive.create({ ...spec, user_id: user._id });
      console.log(`Created "${spec.name}"`);
    } else {
      console.log(`"${spec.name}" already exists`);
    }
    hives.push(beehive);
  }

  console.log("\n--------------------------------------------");
  console.log("Login with:   %s / %s", DEMO_EMAIL, DEMO_PASSWORD);
  console.log("--------------------------------------------");
  for (const hive of hives) {
    console.log("%s  %s", hive._id.toString(), hive.name);
  }
  console.log("--------------------------------------------");
  console.log("\nGive them data with:  npm run simulate -- --all --backfill 6");
  console.log("For the Pi, put one id in credentials_and_beehive_id.txt as:");
  console.log("beehive_id: %s", hives[0]._id.toString());

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
