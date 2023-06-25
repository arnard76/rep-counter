import KeyRepArea from "$lib/key-rep-area/keyRepArea";
import type KeyRepAreaObject from "$lib/key-rep-area";

type Exercises = Exercise[];

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

type ExercisesData = {
  id: string;
  name: string;
  focusLimbs: {
    [key: string]: {
      keyRepAreas: KeyRepAreaObject[];
      startKeyRepAreaIsEnd?: boolean;
    };
  };
}[];

export default Exercise;
export { Exercises, ExercisesData };
