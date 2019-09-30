export function testString(testObject: object): boolean {
  const values = Object.values(testObject);

  for (let value of values) {
    if (typeof value !== 'string') {
      return true;
    }
  }

  return false;
}
