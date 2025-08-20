import { useState, useRef, useEffect } from "react";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  getRecordingPermissionsAsync,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export interface RecordingResult {
  uri: string;
  duration: number;
  size: number;
}

export function useAudioRecording() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check permissions on mount
  useEffect(() => {
    checkExistingPermissions();
  }, []);

  // Check existing permissions
  const checkExistingPermissions = async () => {
    try {
      const status = await getRecordingPermissionsAsync();
      setHasPermission(status.granted);
    } catch (error) {
      console.error("Failed to check permissions:", error);
      setHasPermission(false);
    }
  };

  // Request audio permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      console.log("Requesting audio permissions...");

      const result = await requestRecordingPermissionsAsync();
      console.log("Permission request result:", result);

      const granted = result.granted;
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error("Permission request failed:", error);
      setHasPermission(false);
      return false;
    }
  };

  // Configure audio settings (simplified for expo-audio)
  const configureAudio = async () => {
    // expo-audio handles audio configuration automatically
    // No manual configuration needed
  };

  // Start recording
  const startRecording = async (): Promise<boolean> => {
    try {
      // Check permissions first
      const hasPerms = hasPermission ?? (await requestPermissions());
      if (!hasPerms) {
        throw new Error("Audio permission not granted");
      }

      console.log("Starting recording...");
      console.log("AudioRecorder state before:", audioRecorder);

      // Prepare and start recording with useAudioRecorder
      console.log("Preparing recording...");
      await audioRecorder.prepareToRecordAsync();
      
      console.log("Starting to record...");
      audioRecorder.record();
      
      console.log("AudioRecorder state after recording start:", audioRecorder);

      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      return true;
    } catch (error) {
      console.error("Start recording failed:", error);
      setIsRecording(false);
      return false;
    }
  };

  // Stop recording
  const stopRecording = async (): Promise<RecordingResult | null> => {
    try {
      // Remove the isRecording check - it's unreliable in expo-audio
      // Check our own recording state instead
      if (!isRecording) {
        throw new Error("No active recording - not in recording state");
      }

      console.log("Stopping audio recording...");
      console.log("AudioRecorder state before stop:", audioRecorder);

      // Clear duration timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop the recording - this should work even if isRecording is false
      const stopResult = await audioRecorder.stop();
      console.log("Recording stopped, stop result:", stopResult);
      console.log("AudioRecorder URI property:", audioRecorder.uri);

      // Use the URI from the audioRecorder object if stop() didn't return one
      const uri = stopResult || audioRecorder.uri;
      console.log("Final URI to use:", uri);

      if (typeof uri === "undefined" || uri === null) {
        throw new Error("Recording URI not available");
      }

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);

      const result: RecordingResult = {
        uri,
        duration: recordingDuration,
        size: fileInfo.exists ? fileInfo.size || 0 : 0,
      };

      // Cleanup
      setIsRecording(false);
      setRecordingDuration(0);

      return result;
    } catch (error) {
      console.error("Stop recording failed:", error);

      // Cleanup on error
      setIsRecording(false);
      setRecordingDuration(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return null;
    }
  };

  // Cancel recording
  const cancelRecording = async (): Promise<void> => {
    try {
      // Always try to stop, regardless of isRecording state
      await audioRecorder.stop();
    } catch (error) {
      console.error("Cancel recording failed:", error);
    } finally {
      // Always cleanup
      setIsRecording(false);
      setRecordingDuration(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    // State
    isRecording,
    recordingDuration,
    hasPermission,

    // Actions
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermissions,

    // Utilities
    formatDuration,
  };
}
