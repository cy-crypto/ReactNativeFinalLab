import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { User, Mail, GraduationCap, Users, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../supabaseClient';

// Add Student type for Supabase data
interface Student {
  id: number;
  Name: string;
  Mail: string;
  Program: string;
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch students from Supabase
  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Data')
      .select('*')
      .order('id', { ascending: false });
    if (!error) setStudents(data || []);
    setLoading(false);
  };

  // Real-time subscription
  useEffect(() => {
    fetchStudents();
    const channel = supabase
      .channel('public:Data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Data' }, () => {
        fetchStudents();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !program.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    const { error } = await supabase.from('Data').insert({
      Name: name.trim(),
      Mail: email.trim(),
      Program: program.trim(),
    });
    if (error) {
      Alert.alert('Error', 'Failed to register student');
      return;
    }
    setName('');
    setEmail('');
    setProgram('');
    Alert.alert('Success', 'Student registered successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Student Registration</Text>
          <Text style={styles.headerSubtitle}>Register for our courses</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <User size={20} color="#007AFF" />
              <Text style={styles.inputLabel}>Student Name</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#8E8E93"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Mail size={20} color="#007AFF" />
              <Text style={styles.inputLabel}>Email</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <GraduationCap size={20} color="#007AFF" />
              <Text style={styles.inputLabel}>Program</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={program}
              onChangeText={setProgram}
              placeholder="Enter your program of study"
              placeholderTextColor="#8E8E93"
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.studentsSection}>
          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={() => setShowStudents(!showStudents)}
          >
            <Users size={20} color="#007AFF" />
            <Text style={styles.toggleButtonText}>
              {showStudents ? 'Hide' : 'Show'} Registered Students ({students.length})
            </Text>
            {showStudents ? (
              <EyeOff size={20} color="#007AFF" />
            ) : (
              <Eye size={20} color="#007AFF" />
            )}
          </TouchableOpacity>

          {showStudents && (
            <View style={styles.studentsList}>
              {loading ? (
                <Text>Loading...</Text>
              ) : students.length === 0 ? (
                <Text style={styles.noStudentsText}>No students registered yet</Text>
              ) : (
                students.map((student: Student) => (
                  <View key={student.id} style={styles.studentCard}>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{student.Name}</Text>
                      <Text style={styles.studentEmail}>{student.Mail}</Text>
                    </View>
                    <View style={styles.programBadge}>
                      <Text style={styles.programText}>{student.Program}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C3C43',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  studentsSection: {
    margin: 20,
    marginTop: 0,
  },
  toggleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    marginLeft: 8,
  },
  studentsList: {
    marginTop: 16,
  },
  noStudentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E93',
    fontStyle: 'italic',
    padding: 20,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  programBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  programText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1976D2',
  },
});