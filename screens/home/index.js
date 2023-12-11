import { StatusBar } from "expo-status-bar";
import { ViewWrapper } from "../../components/viewWrapper";
import { Button, Text } from "react-native";
import { useEffect, useState } from "react";
import { userDoc } from "../../services/firebase";
import { gzclp } from "../../utils/gzclp";

export function HomeScreen({ route }) {
  const { user } = route.params;
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const res = await userDoc(user);
      setUserData(res);
      console.log("userData", userData);
    };

    getUserData();
  }, []);

  if (!userData) {
    return (
      <ViewWrapper>
        <StatusBar style="auto" />
        <Text>Loading</Text>
      </ViewWrapper>
    );
  } else {
    const { current_workout, t1, t2 } = userData.programInfo;
    const currentWorkout = [];
    const testArr = ["a", "b", "c"];

    gzclp.workouts.forEach((workout, index) => {
      const exercise = workout.t1;
      const t1WorkoutProgress = t1.find(
        (item) => Object.keys(item)[0] === exercise
      );
      console.log(t1WorkoutProgress[exercise]);

      const workoutObj = {
        t1: {
          exercise,
          // sets: gzclp.progression.t1[t1WorkoutProgress[exercise]].sets,
          // reps: gzclp.progression.t1[t1WorkoutProgress[exercise]].reps,
          weight: t1WorkoutProgress[exercise].current,
        },
        t2,
      };
      currentWorkout.push(workoutObj);
    });

    /* {currentWorkout.forEach((workout) => {
          console.log('workout', workout.t1.exercise);
          return <Button>hi</Button>;
        })} */

    return (
      <ViewWrapper>
        <StatusBar style="auto" />
        {/* <Text>Item</Text> */}

      </ViewWrapper>
    );
  }
}
