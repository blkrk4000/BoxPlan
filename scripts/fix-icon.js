const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const iconPath = path.join(buildDir, 'icon.png');

// A valid base64 encoded 512x512 transparent PNG to ensure build success
// This acts as a fallback if the main icon is corrupted by git/transfer.
const fallbackIconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmAxQTDjBv55yZAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QVJuZnQAAAGRJREFUeNrt0zENAAAMA6D517429pDCSA10VO68AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwZm7/AAHq7Z6KAAAAAElFTkSuQmCC";

// Check if directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

let shouldOverwrite = false;

if (!fs.existsSync(iconPath)) {
  console.log('⚠️  Icon not found. Generating fallback icon...');
  shouldOverwrite = true;
} else {
  // Check if file is corrupted (too small or empty)
  const stats = fs.statSync(iconPath);
  if (stats.size < 100) {
    console.log('⚠️  Icon appears corrupted (too small). Regenerating fallback icon...');
    shouldOverwrite = true;
  }
}

if (shouldOverwrite) {
  try {
    const buffer = Buffer.from(fallbackIconBase64, 'base64');
    fs.writeFileSync(iconPath, buffer);
    console.log('✅ Valid placeholder icon created at build/icon.png');
  } catch (err) {
    console.error('❌ Failed to create icon:', err);
  }
} else {
  console.log('✅ Valid icon found.');
}
