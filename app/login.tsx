import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { login } from '../src/api/auth';
import { useAuth } from '../src/store/auth';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const setUser = useAuth((state) => state.setUser);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data: any) => {
      setErrorMessage('');
      setUser(data);

      switch (data.role) {
        case 'SYSTEM_ADMIN':
          router.replace('/home-sysadmin');
          break;
        case 'SCHOOL_ADMIN':
          router.replace('/home-schooladmin');
          break;
        case 'TEACHER':
          router.replace('/home-teacher');
          break;
        case 'STUDENT':
          router.replace('/home-student');
          break;
        default:
          router.replace('/');
      }
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data || 'Login failed.';
      setErrorMessage(backendMessage);
    },
  });

  const isPending = mutation.status === 'pending';

  const renderLoginForm = () => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={() => mutation.mutate()}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>DigiBackpack</Text>
        {Platform.OS === 'web' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            style={{ width: '100%' }}
          >
            {renderLoginForm()}
          </form>
        ) : (
          renderLoginForm()
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#124E57',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#124E57',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    alignItems: 'center',
    width: '100%',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: 300, // Keeps it centered and not too wide
  },
  button: {
    backgroundColor: '#F15A22',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: 300, // Aligns with maxWidth of input
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  error: {
    color: '#F15A22',
    marginBottom: 12,
    textAlign: 'center',
  },
});
