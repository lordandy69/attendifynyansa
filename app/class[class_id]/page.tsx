// Add this function at the beginning of your component

async function checkExistingJoin(student_id_code: string) {
  const { data: classData, error } = await supabase
    .from('classes')
    .select('students_joined')
    .single();

  if (error) {
    console.error('Error fetching class data:', error);
    return null;
  }

  if (classData && classData.students_joined) {
    const existingJoin = classData.students_joined.find(
      (student: studentsJoinedArray) => student.join_id === student_id_code
    );

    return existingJoin || null;
  }

  return null;
}

// Update the useEffect hook that listens for student joins
useEffect(() => {
  const channel = supabase
    .channel('students-joined')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'classes',
        filter: `class_id=eq.${params.class_id}`,
      },

      async (payload) => {
        const updatedClass = payload.new as classData;
        setClassData(updatedClass);

        // Update the QR code when a new student joins
        if (
          updatedClass.students_joined?.length >
          (class_data?.students_joined?.length || 0)
        ) {
          const latestJoin =
            updatedClass.students_joined[
              updatedClass.students_joined.length - 1
            ];
          const existingJoin = await checkExistingJoin(latestJoin.join_id);

          if (!existingJoin) {
            // If it's a new join, update the current code index
            setCurrentCodeIndex(
              (prevIndex) =>
                (prevIndex + 1) % (updatedClass.rnd_codes?.length || 1)
            );
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [supabase, params.class_id, class_data?.students_joined?.length]);
