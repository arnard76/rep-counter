import KeyRepArea from "$legacy-pages-lib/key-rep-area/keyRepArea";
import type KeyRepAreaObject from "$legacy-pages-lib/key-rep-area";

type Exercises = {
  // key is exercise id
  [key: string]: Exercise;
};

type Exercise = {
  name: string;
  focusLimbs: {
    [key: string]: {
      keyRepAreas: KeyRepArea[];
      startKeyRepAreaIsEnd?: boolean;
    } & Object;
  };
};

type ExerciseData = {
  name: string;
  focusLimbs: {
    [key: string]: {
      keyRepAreas: KeyRepAreaObject[];
      startKeyRepAreaIsEnd?: boolean;
    };
  };
};

type ExercisesData = {
  // key is exercise id
  [key: string]: ExerciseData;
};

export default Exercise;
export { Exercises, ExerciseData, ExercisesData };
