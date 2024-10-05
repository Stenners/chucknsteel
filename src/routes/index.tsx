import { Flex, Button, Container, TextField, Heading, Box, Checkbox } from "@radix-ui/themes";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";
import { getWorkout } from "../services/supabase";
// import { userDoc, UserData } from "../services/firebase";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});


function Index() {
  const auth = useAuth();
  const [workout, setWorkout] = useState<any[]>([]);
  
  useEffect(() => {
    if (auth.user) {
      const { id } = auth.user;
      const workout = async () => {
        const workoutData = await getWorkout(id); // Ensure getWorkout returns the correct type
        setWorkout(workoutData); // Use the returned data
      };
      workout();
    }
  }, [auth]);

  return (
    <>
      <Container>
        <Flex direction="column" gap="3">
          {workout.map((exercise) => (
            <Box key={exercise.id} mb="3">
              <Heading size="3" mb="2">{exercise.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</Heading>
              <Flex mb="2">
                <Box width="30%">Set</Box>
                <Box width="30%">Weight</Box>
                <Box width="30%">Reps</Box>
              </Flex>
              {Array.from({ length: exercise.sets }, (_, index) => (
                <Flex key={index}>
                  <Box width="30%">{index + 1}</Box>
                  <Box width="30%"><TextField.Root defaultValue={exercise.weight}></TextField.Root></Box>
                  <Box width="30%"><TextField.Root defaultValue={exercise.reps}></TextField.Root></Box>
                  <Box width="10%">
                    <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
                      <Checkbox />
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </Box>
          ))}
        </Flex>
      </Container>
      <Container>
        <Button>Complete</Button>
      </Container>
    </>
  );
}
