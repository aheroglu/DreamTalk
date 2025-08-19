import { useState } from 'react';
import { OpenAIService, DreamInterpretation, DreamAnalysisRequest } from '../services/openai';

export interface DreamInterpretationState {
  isLoading: boolean;
  interpretation: DreamInterpretation | null;
  error: string | null;
  isConfigured: boolean;
}

export function useDreamInterpretation() {
  const [state, setState] = useState<DreamInterpretationState>({
    isLoading: false,
    interpretation: null,
    error: null,
    isConfigured: OpenAIService.validateConfiguration(),
  });

  const interpretDream = async (request: DreamAnalysisRequest): Promise<DreamInterpretation | null> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const interpretation = await OpenAIService.interpretDream(request);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        interpretation,
        error: null,
      }));

      return interpretation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        interpretation: null,
      }));

      return null;
    }
  };

  const clearInterpretation = () => {
    setState(prev => ({
      ...prev,
      interpretation: null,
      error: null,
    }));
  };

  const clearError = () => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  return {
    // State
    isLoading: state.isLoading,
    interpretation: state.interpretation,
    error: state.error,
    isConfigured: state.isConfigured,
    
    // Actions
    interpretDream,
    clearInterpretation,
    clearError,
  };
}