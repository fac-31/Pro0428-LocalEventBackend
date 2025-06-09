// replace-imports.ts
const filesToUpdate = [
  "src/controllers/auth.controller.ts",
  "src/controllers/user.controller.ts",
  "src/services/auth.service.ts",
  "src/services/user.service.ts",
  "src/utils/event.utils.ts",
  "testing/dummyData/event.samples.ts",
  "testing/dummyData/realData.samples.ts",
  "testing/testScripts/event.utils.test.ts",
];

const remoteBaseURL = "https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/";

for (const filePath of filesToUpdate) {
  try {
    let content = await Deno.readTextFile(filePath);

    // Regex to find imports from 'models/...' (single or double quotes)
    const importRegex = /from\s+['"]models\/([^'"]+)['"]/g;

    // Replace all matching imports
    const newContent = content.replace(importRegex, (_, modulePath) => {
      return `from "${remoteBaseURL}${modulePath}"`;
    });

    if (content !== newContent) {
      await Deno.writeTextFile(filePath, newContent);
      console.log(`Updated imports in ${filePath}`);
    } else {
      console.log(`No imports to update in ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error.message);
  }
}
