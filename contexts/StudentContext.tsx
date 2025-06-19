import { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
}

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      ...studentData,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  return (
    <StudentContext.Provider value={{ students, addStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
}