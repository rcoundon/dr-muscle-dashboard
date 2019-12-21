export function calculateBodyPartTotals(exerciseVolume) {
  if (exerciseVolume.length === 0) return [];
  const bodyPartVolumes = {};
  exerciseVolume.forEach(exerciseGroup => {
    exerciseGroup.forEach(exercise => {
      const bodyPartKeys = Object.keys(bodyPartVolumes);
      // console.log(
      //   `Comparing ${bodyPartKeys} to ${
      //     exercise.bodyPartId
      //   } ${bodyPartKeys.includes('' + exercise.bodyPartId)}`
      // );
      if (!bodyPartKeys.includes('' + exercise.bodyPartId)) {
        // console.log('adding body part key: ' + exercise.bodyPartId);
        bodyPartVolumes[exercise.bodyPartId] = {};
      }

      if (!bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber]) {
        // console.log(
        //   `adding bodyPartVolumes[${exercise.bodyPartId}][exercise.weekNumber]`
        // );
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber] = {};
      } else {
        // console.log(
        //   `bodyPartVolumes[${exercise.bodyPartId}][exercise.weekNumber] already exists`
        // );
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

      if (
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber].totalKgLifted
      ) {
        // console.log('adding');
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted += exercise.totalKgLifted;
      } else {
        // console.log('new');
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted = exercise.totalKgLifted;
      }
      // console.log(
      //   `adding bodyPartVolumes[${
      //     exercise.bodyPartId
      //   }][exercise.weekNumber].totalKgLifted = ${(bodyPartVolumes[
      //     exercise.bodyPartId
      //   ][exercise.weekNumber].totalKgLifted = exercise.totalKgLifted)}`
      // );
    });
  });

  return bodyPartVolumes;
}
