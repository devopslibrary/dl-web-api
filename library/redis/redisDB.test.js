const redisDB = require("./redisDB");

test("Should be able to talk to Redis properly", async () => {
  await redisDB.set('testkey', 'testvalue')
  const output = await redisDB.get('testkey');
  expect(output).toEqual("testvalue");
});
