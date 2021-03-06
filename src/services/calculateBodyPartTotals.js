/* eslint-disable no-debugger */
export function calculateBodyPartTotals(exerciseVolume) {
  let id = getRandomInt(1, 100);
  console.time('calculateBodyPartTotals-' + id);
  if (exerciseVolume.length === 0) return [];

  // Build an object to hold the set and weight volumes for all exercises performed
  // categorised by body part
  // The output has two top level properties - an array of volumes that represent the total body parts
  // set volume and an object that represents the individual exercise totals of hard sets, again
  // categorised by body part
  const output = {
    bodyPartVolumes: [],
    exerciseTotals: {},
  };
  const bodyPartVolumes = {};
  exerciseVolume.forEach((exerciseGroup) => {
    exerciseGroup.forEach((exercise) => {
      const bodyPartKeys = Object.keys(bodyPartVolumes);

      // We haven't seen this body part before so create object to represent it
      if (!bodyPartKeys.includes('' + exercise.bodyPartId)) {
        bodyPartVolumes[exercise.bodyPartId] = {};
      }
      // We haven't seen this week number before for this body part before so create object to represent it
      if (!bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber]) {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber] = {};
      }
      // We haven't seen this exercise in this week for this body part before so create object to represent it
      if (
        !bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber][
          exercise.exerciseId
        ]
      ) {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber][
          exercise.exerciseId
        ] = 0;
      } else {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber][
          exercise.exerciseId
        ]++;
      }

      if (
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber].totalHardSets
      ) {
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalHardSets += exercise.totalHardSets;
      } else {
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalHardSets = exercise.totalHardSets;
      }

      // Build exercise totals - include each instance of an exercise against the
      // corresponding body part
      // If we haven't seen this body part before add an object to hold the details
      if (!output.exerciseTotals[exercise.bodyPartId]) {
        output.exerciseTotals[exercise.bodyPartId] = {};
      }

      if (!output.exerciseTotals[exercise.bodyPartId]) {
        output.exerciseTotals[exercise.bodyPartId] = {};
      }
      // If we haven't seen this exercise before for this body part, add it
      if (!output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId]) {
        output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId] = {
          totalWorkouts: 1,
          totalHardSets: exercise.totalHardSets,
        };
      } else {
        // We've seen this body part/exercise combination before, so add the hard sets to the existing value
        output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId]
          .totalWorkouts++;
        output.exerciseTotals[exercise.bodyPartId][
          exercise.exerciseId
        ].totalHardSets += exercise.totalHardSets;
      }

      if (
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber].totalKgLifted
      ) {
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted += exercise.totalLbLifted;
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalLbLifted += exercise.totalKgLifted * 2.2;
      } else {
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted = exercise.totalKgLifted;

        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalLbLifted = exercise.totalKgLifted * 2.2;
      }
    });
  });

  output.bodyPartVolumes = bodyPartVolumes;
  console.timeEnd('calculateBodyPartTotals-' + id);
  return output;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
