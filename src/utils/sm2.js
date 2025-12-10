export const calculateNextReview = (quality, repetitions, previousInterval, previousEf) => {
  let interval;
  let ef = previousEf;

  if (quality < 3) {
    return { interval: 1, repetitions: 0, ef: previousEf };
  }

  ef = previousEf + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  if (repetitions === 0) {
    interval = 1;
  } else if (repetitions === 1) {
    interval = 6;
  } else {
    interval = Math.round(previousInterval * ef);
  }

  return { interval, repetitions: repetitions + 1, ef };
};