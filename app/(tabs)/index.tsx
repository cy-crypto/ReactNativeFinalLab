import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { BookOpen, Clock, Users } from 'lucide-react-native';

const courses = [
  {
    id: '1',
    title: 'Math 101',
    description: 'Fundamentals of mathematics including algebra and geometry',
    duration: '8 weeks',
    students: 245,
  },
  {
    id: '2',
    title: 'Biology Basics',
    description: 'Introduction to biological sciences and life processes',
    duration: '10 weeks',
    students: 189,
  },
  {
    id: '3',
    title: 'Intro to React Native',
    description: 'Build mobile apps with React Native and JavaScript',
    duration: '12 weeks',
    students: 312,
  },
  {
    id: '4',
    title: 'English Literature',
    description: 'Classic and modern literature analysis and writing',
    duration: '6 weeks',
    students: 156,
  },
  {
    id: '5',
    title: 'Chemistry 101',
    description: 'Basic principles of chemistry and lab techniques',
    duration: '9 weeks',
    students: 203,
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Courses</Text>
        <Text style={styles.headerSubtitle}>Choose from our selection of courses</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <BookOpen size={24} color="#007AFF" />
              <Text style={styles.courseTitle}>{course.title}</Text>
            </View>
            
            <Text style={styles.courseDescription}>{course.description}</Text>
            
            <View style={styles.courseInfo}>
              <View style={styles.infoItem}>
                <Clock size={16} color="#8E8E93" />
                <Text style={styles.infoText}>{course.duration}</Text>
              </View>
              <View style={styles.infoItem}>
                <Users size={16} color="#8E8E93" />
                <Text style={styles.infoText}>{course.students} students</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  courseDescription: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 22,
    marginBottom: 16,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
  },
});