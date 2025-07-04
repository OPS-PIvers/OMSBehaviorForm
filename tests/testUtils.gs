/**
 * testUtils.gs - Utility functions for testing in Google Apps Script.
 */

/**
 * Asserts that two values are equal.
 * @param {*} expected The expected value.
 * @param {*} actual The actual value.
 * @param {string} message The message to display if the assertion fails.
 */
function assertEquals(expected, actual, message) {
  if (expected !== actual) {
    let details = `Expected: ${expected} (Type: ${typeof expected}), Actual: ${actual} (Type: ${typeof actual})`;
    throw new Error(`Assertion Failed: ${message}. ${details}`);
  }
  // console.log(`AssertEquals PASSED: ${message}`);
}

/**
 * Asserts that a value is true.
 * @param {boolean} actual The value to check.
 * @param {string} message The message to display if the assertion fails.
 */
function assertTrue(actual, message) {
  if (actual !== true) {
    throw new Error(`Assertion Failed: ${message}. Expected true, but got ${actual}.`);
  }
  // console.log(`AssertTrue PASSED: ${message}`);
}

/**
 * Asserts that a value is false.
 * @param {boolean} actual The value to check.
 * @param {string} message The message to display if the assertion fails.
 */
function assertFalse(actual, message) {
  if (actual !== false) {
    throw new Error(`Assertion Failed: ${message}. Expected false, but got ${actual}.`);
  }
  // console.log(`AssertFalse PASSED: ${message}`);
}

/**
 * Asserts that an object is not null or undefined.
 * @param {*} actual The object to check.
 * @param {string} message The message to display if the assertion fails.
 */
function assertNotNull(actual, message) {
  if (actual === null || actual === undefined) {
    throw new Error(`Assertion Failed: ${message}. Expected not null, but got ${actual}.`);
  }
  // console.log(`AssertNotNull PASSED: ${message}`);
}

/**
 * Asserts that a function throws an error.
 * @param {Function} func The function to execute.
 * @param {string} [expectedErrorMessage] Optional. If provided, checks if the error message contains this string.
 * @param {string} message The message to display if the assertion fails.
 */
function assertThrows(func, expectedErrorMessage, message) {
  let caughtError = false;
  try {
    func();
  } catch (e) {
    caughtError = true;
    if (expectedErrorMessage && !e.message.includes(expectedErrorMessage)) {
      throw new Error(`Assertion Failed: ${message}. Error message "${e.message}" did not include expected "${expectedErrorMessage}".`);
    }
    // console.log(`AssertThrows PASSED (Caught expected error): ${message}`);
    return; // Test passed
  }
  if (!caughtError) {
    throw new Error(`Assertion Failed: ${message}. Expected function to throw an error, but it did not.`);
  }
}

/**
 * A simple test group runner.
 * @param {string} groupName Name of the test group.
 * @param {Function} testFunction Function containing multiple assertions.
 * @param {object} summary Object to store summary {passed: number, failed: number}
 */
function testGroup(groupName, testFunction, summary) {
    console.log(`\n--- Running Test Group: ${groupName} ---`);
    try {
        testFunction();
        console.log(`--- Test Group PASSED: ${groupName} ---`);
        summary.passed++;
    } catch (e) {
        console.error(`--- Test Group FAILED: ${groupName} ---`);
        console.error(e.stack || e.message);
        summary.failed++;
    }
}

/**
 * Runs multiple test functions and logs a summary.
 * @param {Array<{name: string, func: Function}>} testsToRun Array of objects with test name and function.
 * @return {boolean} True if all tests passed, false otherwise.
 *
 * Example usage:
 * function runAllMyProjectTests() {
 *   const allTests = [
 *     { name: 'DataValidator Tests', func: runDataValidatorTests },
 *     // { name: 'AnotherModule Tests', func: runAnotherModuleTests }
 *   ];
 *   runTests(allTests);
 * }
 */
function runTests(testsToRun) {
    console.log('===================================');
    console.log(' STARTING ALL TESTS ');
    console.log('===================================');
    const summary = { passed: 0, failed: 0, total: testsToRun.length };

    testsToRun.forEach(testSpec => {
        console.log(`\n>>> Running suite: ${testSpec.name}`);
        try {
            const result = testSpec.func.call(null); // Call the test function (e.g., runDataValidatorTests)
            if (result === false) { // If the test function itself indicates failure
                summary.failed++;
                console.log(`<<< Suite FAILED (indicated by test function): ${testSpec.name}`);
            } else {
                summary.passed++;
                console.log(`<<< Suite PASSED: ${testSpec.name}`);
            }
        } catch (e) {
            summary.failed++;
            console.error(`<<< Suite FAILED (exception caught): ${testSpec.name}`);
            console.error(e.stack || e.message);
        }
    });

    console.log('\n===================================');
    console.log(' TEST EXECUTION SUMMARY ');
    console.log('===================================');
    console.log(`Total Suites: ${summary.total}`);
    console.log(`Suites Passed: ${summary.passed}`);
    console.log(`Suites Failed: ${summary.failed}`);
    console.log('===================================');

    if (summary.failed > 0) {
        console.error('ATTENTION: SOME TESTS FAILED!');
        return false;
    } else {
        console.log('ALL TESTS PASSED SUCCESSFULLY!');
        return true;
    }
}
