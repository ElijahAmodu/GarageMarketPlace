import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  name: string;
  confirmPassword: string;
}

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        if (data.password !== data.confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        await register(data.name, data.email, data.password);
      }
    } catch (error) {
      Alert.alert("Error", "Authentication failed. Please try again.");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>GarageSpace</Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Welcome back!" : "Join the marketplace"}
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your name"
                      autoCapitalize="words"
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your password"
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{ required: "Please confirm your password" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Confirm your password"
                      secureTextEntry
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleButtonText}>
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  toggleButton: {
    alignItems: "center",
    padding: 16,
  },
  toggleButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default LoginScreen;
