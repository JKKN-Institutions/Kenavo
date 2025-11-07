/**
 * Test Script: Year Extraction Logic
 *
 * Tests the extractGradYear function with various input formats
 * to ensure it correctly extracts both ranges and single years.
 */

// Enhanced extractGradYear function
function extractGradYear(tenure) {
  if (!tenure || tenure.trim() === '') {
    return '';
  }

  // PRIORITY 1: Year range (e.g., "1993-2000" or "1993 - 2000")
  const rangeMatch = tenure.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]}`;  // Return full range
  }

  // PRIORITY 2: Single year patterns
  const singleYearPatterns = [
    /class of (\d{4})/i,                 // Matches "Class of 1995"
    /batch[:\s]+(\d{4})/i,               // Matches "Batch: 1995" or "Batch 1995"
    /(\d{4})[:\s]*batch/i,               // Matches "1995 Batch"
    /graduated[:\s]+(\d{4})/i,           // Matches "Graduated: 1995"
    /(\d{4})$/,                          // Matches "1995" at end
    /\b(\d{4})\b/,                       // Any 4-digit number (fallback)
  ];

  for (const pattern of singleYearPatterns) {
    const match = tenure.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return '';
}

// Test cases
const testCases = [
  // Year ranges (should return full range)
  { input: '1993-2000', expected: '1993-2000', description: 'Year range with hyphen' },
  { input: '1993 - 2000', expected: '1993-2000', description: 'Year range with spaces' },
  { input: '1990-1995', expected: '1990-1995', description: 'Different year range' },
  { input: '1997–2000', expected: '1997-2000', description: 'Year range with en-dash' },

  // Single years
  { input: '2000', expected: '2000', description: 'Single year only' },
  { input: 'Class of 2000', expected: '2000', description: 'Class of format' },
  { input: 'Batch: 1995', expected: '1995', description: 'Batch format with colon' },
  { input: 'Batch 1995', expected: '1995', description: 'Batch format without colon' },
  { input: '1995 Batch', expected: '1995', description: 'Year before batch' },
  { input: 'Graduated: 2000', expected: '2000', description: 'Graduated format' },

  // Edge cases
  { input: '', expected: '', description: 'Empty string' },
  { input: 'No year here', expected: '', description: 'No year present' },
  { input: '  1993-2000  ', expected: '1993-2000', description: 'Year range with whitespace' },
];

// Run tests
console.log('Testing extractGradYear function\n');
console.log('='.repeat(80));

let passedCount = 0;
let failedCount = 0;

testCases.forEach((testCase, index) => {
  const result = extractGradYear(testCase.input);
  const passed = result === testCase.expected;

  if (passed) {
    passedCount++;
    console.log(`✓ Test ${index + 1}: ${testCase.description}`);
    console.log(`  Input: "${testCase.input}"`);
    console.log(`  Result: "${result}"`);
  } else {
    failedCount++;
    console.log(`✗ Test ${index + 1}: ${testCase.description}`);
    console.log(`  Input: "${testCase.input}"`);
    console.log(`  Expected: "${testCase.expected}"`);
    console.log(`  Got: "${result}"`);
  }
  console.log();
});

console.log('='.repeat(80));
console.log(`Test Results: ${passedCount} passed, ${failedCount} failed out of ${testCases.length} tests`);

if (failedCount === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${failedCount} test(s) failed`);
  process.exit(1);
}
