const redisDB = require("./redisDB");

test("Should be able to talk to Redis properly", async () => {
  const output = await redisDB.hget("ghorg:4631459", "id");
  expect(output).toEqual("4631459");
});
