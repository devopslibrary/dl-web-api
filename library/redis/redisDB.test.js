const redisDB = require("./redisDB");

test("Should be able to talk to Redis properly", async () => {
  const output = await redisDB.hget("ghorg:11233903", "app_id");
  expect(output).toEqual("30108");
});
