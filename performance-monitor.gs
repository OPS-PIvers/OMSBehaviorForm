/**
 * Performance monitoring and testing utilities
 */

class PerformanceMonitor {
  static measureFunction(func, label = 'Function') {
    const startTime = new Date().getTime();
    const result = func();
    const endTime = new Date().getTime();
    const duration = endTime - startTime;

    console.log(`${label} took ${duration}ms`);
    this.recordPerformanceMetric(label, duration);

    return result;
  }

  static loadTest(testFunction, concurrentUsers = 5, iterations = 10) {
    console.log(`Starting load test: ${concurrentUsers} users, ${iterations} iterations each`);

    const results = [];
    const startTime = new Date().getTime();

    // Simulate concurrent users (Google Apps Script limitation: sequential execution)
    for (let user = 0; user < concurrentUsers; user++) {
      for (let iteration = 0; iteration < iterations; iteration++) {
        try {
          const iterationStart = new Date().getTime();
          testFunction();
          const iterationEnd = new Date().getTime();

          results.push({
            user: user,
            iteration: iteration,
            duration: iterationEnd - iterationStart,
            success: true
          });
        } catch (error) {
          results.push({
            user: user,
            iteration: iteration,
            error: error.toString(),
            success: false
          });
        }
      }
    }

    const endTime = new Date().getTime();

    return this.analyzeLoadTestResults(results, endTime - startTime);
  }

  static recordPerformanceMetric(label, duration) {
    // Placeholder for recording metrics, e.g., to a Spreadsheet or external service
    console.log(`Metric: ${label}, Duration: ${duration}ms`);
    // Example: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PerformanceLog').appendRow([new Date(), label, duration]);
  }

  static analyzeLoadTestResults(results, totalDuration) {
    // Placeholder for analyzing load test results
    console.log(`Load test completed in ${totalDuration}ms`);
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = results.filter(r => !r.success).length;
    const avgDuration = results.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successfulRequests || 0;

    console.log(`Successful requests: ${successfulRequests}`);
    console.log(`Failed requests: ${failedRequests}`);
    console.log(`Average duration per successful request: ${avgDuration.toFixed(2)}ms`);
    return {
        totalDuration,
        successfulRequests,
        failedRequests,
        avgDuration,
        results
    };
  }

  static testFormSubmissionPerformance() {
    // TestDataManager is assumed to be defined in tests/test-data.gs
    // processWebAppFormSubmission is assumed to be defined in webApp.gs
    if (typeof TestDataManager === 'undefined' || typeof processWebAppFormSubmission === 'undefined') {
        console.error('TestDataManager or processWebAppFormSubmission is not available for performance testing.');
        return;
    }
    const testData = TestDataManager.generateSampleBehaviorData();

    return this.measureFunction(() => {
      return processWebAppFormSubmission(testData);
    }, 'Form Submission');
  }

  static testStudentLookupPerformance() {
    // lookupStudent is assumed to be defined elsewhere (e.g. DirectoryInfo.gs or similar)
    if (typeof lookupStudent === 'undefined') {
        console.error('lookupStudent function is not available for performance testing.');
        return;
    }
    return this.measureFunction(() => {
      return lookupStudent('Test', 'Student'); // Example student
    }, 'Student Lookup');
  }
}
