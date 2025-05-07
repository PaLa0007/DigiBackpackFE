import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Platform, Text, TextInput, View } from 'react-native';
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
      setUser(data); // ✅ store user info in Zustand

      // ✅ route based on user role
      if (data.role === 'SYSTEM_ADMIN') {
        router.replace('/home-sysadmin');
      } else if (data.role === 'SCHOOL_ADMIN') {
        router.replace('/home-schooladmin');
      } else if (data.role === 'TEACHER') {
        router.replace('/home-teacher');
      } else if (data.role === 'STUDENT') {
        router.replace('/home-student');
      } else {
        router.replace('/'); // fallback
      }
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data || 'An error occurred';
      setErrorMessage(backendMessage);
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16, textAlign: 'center' }}>Login</Text>

      {Platform.OS === 'web' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            mutation.mutate();
          }}
        >
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <button
            type="submit"
            disabled={mutation.status === 'pending'}
            style={{
              padding: 10,
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              marginTop: 10,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {mutation.status === 'pending' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <Button
            title={mutation.status === 'pending' ? 'Logging in...' : 'Login'}
            onPress={() => mutation.mutate()}
            disabled={mutation.status === 'pending'}
          />
        </>
      )}
    </View>
  );
}
