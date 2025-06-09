import { FrequencyObject, FullEvent } from "https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/event.model.ts";
import { realData } from '../dummyData/realData.samples.ts';
import {
  addNormalizedProperties,
  calculateTermFrequency,
  createEventKey,
  createFrequencyArrays,
} from '../../src/utils/event.utils.ts';
//import { testEvents } from '../dummyData/event.samples.ts'

const testInput = realData;

function testAddNormalizedProperties() {
  let frequencyObject: FrequencyObject = { names: [], allTerms: [] };

  const eventsV1: FullEvent[] = [];
  for (const [, event] of testInput.entries()) {
    const finalObj = addNormalizedProperties(event);
    eventsV1.push(finalObj);
    frequencyObject = createFrequencyArrays(finalObj);
  }

  const TF_IDF_Object = calculateTermFrequency(frequencyObject);
  const result: FullEvent[] = createEventKey(TF_IDF_Object, eventsV1);

  testSaveData(result);
}

let savedData: FullEvent[] = [];
let rejectedData: FullEvent[] = [];
async function testSaveData(
  inputData: FullEvent[],
): Promise<{ saved: FullEvent[]; rejected: FullEvent[]; message: string }> {
  try {
    try {
      const data = await Deno.readTextFile('database.json');
      savedData = JSON.parse(data);
    } catch (error) {
      console.error(error);
      savedData = [];
    }

    try {
      const data2 = await Deno.readTextFile('reject.json');
      rejectedData = JSON.parse(data2);
    } catch (error) {
      console.error(error);
      rejectedData = [];
    }

    const newSaved: FullEvent[] = [];
    const newRejected: FullEvent[] = [];

    for (const event of inputData) {
      const isDuplicate = savedData.some((existingEvent) =>
        existingEvent.eventKey === event.eventKey
      );

      if (isDuplicate) {
        newRejected.push(event);
        rejectedData.push(event);
      } else {
        newSaved.push(event);
        savedData.push(event);
      }
    }

    await Deno.writeTextFile(
      'database.json',
      JSON.stringify(savedData, null, 2),
    );

    await Deno.writeTextFile(
      'reject.json',
      JSON.stringify(rejectedData, null, 2),
    );

    console.log({
      saved: newSaved.length,
      rejected: newRejected.length,
      message:
        `Processed ${inputData.length} events: ${newSaved.length} saved, ${newRejected.length} rejected`,
    });

    return {
      saved: newSaved,
      rejected: newRejected,
      message:
        `Processed ${inputData.length} events: ${newSaved.length} saved, ${newRejected.length} rejected`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error';
    console.error(`Error in testSaveData: ${errorMessage}`);
    return {
      saved: [],
      rejected: [],
      message: `Error processing events: ${errorMessage}`,
    };
  }
}

testAddNormalizedProperties();
