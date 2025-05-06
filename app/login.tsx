import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { login } from '../src/api/auth';
import { useAuth } from '../src/store/auth';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const setToken = useAuth((state) => state.setToken);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data: any) => {
      setErrorMessage('');
      setToken(data.token);
      router.replace('/home');
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data || 'An error occurred';
      setErrorMessage(backendMessage);
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16, textAlign: 'center' }}>Login</Text>
      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 12 }}>{errorMessage}</Text>
      ) : null}
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
    </View>
  );
}
