/* eslint-disable no-debugger */
export function calculateBodyPartTotals(exerciseVolume) {
  if (exerciseVolume.length === 0) return [];
  const output = {
    bodyPartVolumes: [],
    exerciseTotals: {}
  };
  const bodyPartVolumes = {};
  exerciseVolume.forEach(exerciseGroup => {
    exerciseGroup.forEach(exercise => {
      const bodyPartKeys = Object.keys(bodyPartVolumes);
      if (!bodyPartKeys.includes('' + exercise.bodyPartId)) {
        bodyPartVolumes[exercise.bodyPartId] = {};
      }

      if (!bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber]) {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber] = {};
      }

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

      // debugger;
      if (!output.exerciseTotals[exercise.bodyPartId]) {
        output.exerciseTotals[exercise.bodyPartId] = {};
      }
      // If we haven't seen this exercise before for this body part, add it
      if (!output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId]) {
        // debugger;
        output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId] = {
          totalWorkouts: 1,
          totalHardSets: exercise.totalHardSets
        };
      } else {
        // debugger;
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
        ].totalKgLifted += exercise.totalKgLifted;
      } else {
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted = exercise.totalKgLifted;
      }
    });
  });

  output.bodyPartVolumes = bodyPartVolumes;

  return output;
}
