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
      if (!output.exerciseTotals[exercise.bodyPartId]) {
        output.exerciseTotals[exercise.bodyPartId] = {};
      }

      if (!output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId]) {
        output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId] = 1;
      } else {
        output.exerciseTotals[exercise.bodyPartId][exercise.exerciseId]++;
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
