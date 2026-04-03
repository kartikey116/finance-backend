import redisClient from "../config/redis.js";

export const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis Get Error for key ${key}:`, error);
    return null;
  }
};

export const setCache = async (key, value, expiresSeconds = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", expiresSeconds);
  } catch (error) {
    console.error(`Redis Set Error for key ${key}:`, error);
  }
};

export const clearCachePattern = async (pattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(`Redis Clear Error for pattern ${pattern}:`, error);
  }
};
