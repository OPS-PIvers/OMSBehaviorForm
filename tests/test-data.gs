/**
 * Test data management and sample data generation
 */

class TestDataManager {
  static generateSampleStudents(count = 10) {
    const students = [];
    const firstNames = ['Alex', 'Bailey', 'Casey', 'Drew', 'Ellis'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis'];

    for (let i = 0; i < count; i++) {
      students.push({
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        email: `student${i}@testschool.edu`,
        parent1Email: `parent1.${i}@email.com`,
        parent2Email: `parent2.${i}@email.com`
      });
    }
    return students;
  }

  static generateSampleBehaviorData() {
    return {
      behaviorType: 'goodnews',
      studentFirst: 'Test',
      studentLast: 'Student',
      teacherName: 'Test Teacher',
      selectedPillars: ['Responsibility'],
      selectedBehaviors: ['completing work with academic honesty'],
      location: 'Classroom',
      comments: 'Test behavior submission'
    };
  }

  static cleanupTestData() {
    // Remove all test data from spreadsheets
  }
}
