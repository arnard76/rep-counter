import KeyRepArea from "$lib/key-rep-area/keyRepArea";
import type KeyRepAreaObject from "$lib/key-rep-area";

type Exercise = {
  id: string;
  name: string;
  focusLimbs: {
    [key: string]: {
      keyRepAreas: KeyRepArea[];
      startKeyRepAreaIsEnd?: boolean;
    } & Object;
  };
};

type Exercises = {
  // key is exercise id as well
  [key: string]: Exercise;
};

type ExerciseData = {
  id: string;
  name: string;
  focusLimbs: {
    [key: string]: {
      keyRepAreas: KeyRepAreaObject[];
      startKeyRepAreaIsEnd?: boolean;
    };
  };
};

type ExercisesData = {
  // key is exercise id as well
  [key: string]: ExerciseData;
};

export default Exercise;
export { Exercises, ExerciseData, ExercisesData };
