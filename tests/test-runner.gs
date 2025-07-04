/**
 * Main test runner for the Student Behavior Management System
 * Executes all test suites and provides comprehensive reporting
 */

class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
  }

  runAllTests() {
    console.log('Starting comprehensive test suite...');

    // Unit Tests
    this.runUnitTests();

    // Integration Tests
    this.runIntegrationTests();

    // End-to-End Tests
    this.runE2ETests();

    // Performance Tests
    this.runPerformanceTests();

    // Accessibility Tests
    this.runAccessibilityTests();

    this.generateReport();
  }

  runUnitTests() {
    console.log('Running unit tests...');
    // Assumes testUtils.gs (with runTests) and testDataValidator.gs (with runDataValidatorTests) are available.

    let allUnitTestsPassed = true;
    let unitTestSummary = { passed: 0, failed: 0, errors: [] };

    try {
      // Check if the test utility and specific test suites are defined
      if (typeof runTests === 'function' && typeof runDataValidatorTests === 'function') {
        // Define the suites to run
        const unitTestSuites = [
          { name: 'DataValidator Unit Tests', func: runDataValidatorTests }
          // Add other unit test suite functions here, e.g.:
          // { name: 'ErrorHandling Unit Tests', func: runErrorHandlingTests },
        ];

        // The runTests function in testUtils.gs will log details and return true/false
        const success = runTests(unitTestSuites);
        if (!success) {
            allUnitTestsPassed = false;
            // The runTests function already logs detailed summaries.
            // We can augment the main results here if needed.
            // For simplicity, we'll rely on runTests' logging for individual suite pass/fail.
            // This runner's results object will track overall success/failure of categories.
        }
      } else {
        const errorMessage = 'Test utilities (runTests) or DataValidator test suite (runDataValidatorTests) not found.';
        console.error(errorMessage);
        this.results.errors.push(errorMessage);
        allUnitTestsPassed = false;
      }
    } catch (e) {
      console.error('Error during unit test execution: ' + e.message);
      this.results.errors.push('Unit Test Runner Exception: ' + e.message);
      allUnitTestsPassed = false;
    }

    if (allUnitTestsPassed) {
      this.results.passed++; // Incrementing a general 'passed categories' count
      console.log('All unit test suites PASSED.');
    } else {
      this.results.failed++; // Incrementing a general 'failed categories' count
      console.error('One or more unit test suites FAILED.');
    }
  }

  runIntegrationTests() {
    console.log('Running integration tests...');
    // Placeholder for integration test execution
    // Example: this.results.skipped++;
  }

  runE2ETests() {
    console.log('Running end-to-end tests...');
    // Placeholder for E2E test execution
    // Example: this.results.skipped++;
  }

  runPerformanceTests() {
    console.log('Running performance tests...');
    // Placeholder for performance test execution
    // Example:
    // if (typeof PerformanceMonitor !== 'undefined' && PerformanceMonitor.testFormSubmissionPerformance) {
    //   PerformanceMonitor.testFormSubmissionPerformance();
    //   PerformanceMonitor.testStudentLookupPerformance();
    // }
    // this.results.skipped++;
  }

  runAccessibilityTests() {
    console.log('Running accessibility tests...');
    // Placeholder for accessibility test execution (likely manual or using external tools)
    // Example: this.results.skipped++;
  }

  generateReport() {
    console.log('\n--- Test Run Report ---');
    console.log(`Categories Passed: ${this.results.passed}`);
    console.log(`Categories Failed: ${this.results.failed}`);
    console.log(`Categories Skipped: ${this.results.skipped}`);
    if (this.results.errors.length > 0) {
      console.error('Errors encountered during test run:');
      this.results.errors.forEach(err => console.error(`- ${err}`));
    }
    console.log('--- End of Report ---');

    // In a real scenario, this might write to a spreadsheet or send an email.
  }
}

/**
 * Main function to execute all tests.
 * This can be called from the Apps Script editor.
 */
function runFullTestSuite() {
  const runner = new TestRunner();
  runner.runAllTests();
}
