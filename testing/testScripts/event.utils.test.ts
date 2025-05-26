import * as fs from "node:fs";
import { FullEvent } from '../../src/models/event.model.ts';
import { testEvents } from '../dummyData/event.samples.ts'
import { realData } from '../dummyData/realData.samples.ts';
import { normalizeEventTitle, normalizeEventDate, addNormalizedProperties } from "../../src/utils/event.utils.ts";
import { Console } from 'node:console';

const testInput = realData;

function testTitleNormalization() {
  console.log("=== Event Title Normalization Test ===\n");
  
  testInput.forEach((event, index) => {
    console.log(`Event ${index + 1}:`);
    console.log(`Original: "${event.name}"`);
    console.log(`Normalized: "${normalizeEventTitle(event)}"`);
    console.log("");
  });
}
  
function testDateNormalization() {
  // Test date normalization
  console.log("=== Event Date Normalization Test ===\n");
  
  testInput.forEach((event, index) => {
    console.log(`Event ${index + 1}:`);
    console.log(`Original: "${event.date}"`);
    console.log(`Normalized: ${normalizeEventDate(event)}`);
    console.log("");
  });
}

async function testAddNormalizedProperties() {
  console.log("=== test final object ===");
  for (const [index, event] of testInput.entries()) {
    const finalObj = addNormalizedProperties(event);
    const result = await testSaveData(finalObj);
    console.log(result.message);
  }
}

let savedData: FullEvent[] = [];
let rejectedData: FullEvent[] = [];
async function testSaveData(inputData: FullEvent): Promise<{saved: boolean, message: string}> {

  try {
    // Try to read existing data files, create empty arrays if files don't exist
    try {
      const data = await Deno.readTextFile("database.json");
      savedData = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or can't be read, use empty array
      savedData = [];
    }
    
    try {
      const data2 = await Deno.readTextFile("reject.json");
      rejectedData = JSON.parse(data2);
    } catch (error) {
      // If file doesn't exist or can't be read, use empty array
      rejectedData = [];
    }
  
    // Check if the event already exists in the saved data
    // Comparing by normalized name and date (as strings for accurate comparison)
    const isDuplicate = savedData.some(event => 
      event.normalizedName === inputData.normalizedName
    );
    
    if (isDuplicate) {
      console.log(isDuplicate)
      // Event is a duplicate, add to rejected data
      rejectedData.push(inputData);
      await Deno.writeTextFile(
        "reject.json",
        JSON.stringify(rejectedData, null, 2)
      );
      console.log({ saved: false, message: `Event "${inputData.name}" is a duplicate and was rejected` })
      return { saved: false, message: `Event "${inputData.name}" is a duplicate and was rejected` };
    } else {
      // Event is new, add to saved data
      savedData.push(inputData);
      await Deno.writeTextFile(
        "database.json",
        JSON.stringify(savedData, null, 2)
      );
      console.log({ saved: true, message: `Event "${inputData.name}" was successfully saved` })
      return { saved: true, message: `Event "${inputData.name}" was successfully saved` };
    }
  } catch (error) {
    // Handle any errors that occur during processing
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in testSaveData: ${errorMessage}`);
    return { saved: false, message: `Error processing event: ${errorMessage}` };
  }
}


testAddNormalizedProperties()

//testTitleNormalization();
//testDateNormalization();
//testAddNormalizedProperties();