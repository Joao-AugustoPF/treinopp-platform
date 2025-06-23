import { useState, useCallback, useRef, useMemo } from 'react';
import { useCheckTrainerEmail } from './use-treinador';

interface TrainerInfo {
  exists: boolean;
  isTrainer: boolean;
  profile: any;
}

interface UseEmailCheckReturn {
  trainerInfo: TrainerInfo | null;
  checkingEmail: boolean;
  isValidEmail: boolean;
  checkEmail: (email: string) => void;
  clearCache: () => void;
}

export const useEmailCheck = (debounceMs: number = 800): UseEmailCheckReturn => {
  const { checkTrainerEmail } = useCheckTrainerEmail();

  const [trainerInfo, setTrainerInfo] = useState<TrainerInfo | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Cache para evitar requisições duplicadas
  const emailCache = useRef<Map<string, TrainerInfo>>(new Map());
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedEmail = useRef<string>('');

  // Validação de email
  const validateEmail = useCallback((email: string): boolean => {
    if (!email || email.length < 5) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const performEmailCheck = useCallback(
    async (email: string) => {
      // Validações para evitar requisições desnecessárias
      if (!email || !validateEmail(email)) {
        setTrainerInfo(null);
        return;
      }

      // Verificar se já foi verificado recentemente
      if (lastCheckedEmail.current === email) {
        return;
      }

      // Verificar cache
      if (emailCache.current.has(email)) {
        const cachedResult = emailCache.current.get(email)!;
        setTrainerInfo(cachedResult);
        lastCheckedEmail.current = email;
        return;
      }

      setCheckingEmail(true);
      try {
        const result = await checkTrainerEmail(email);

        // Armazenar no cache
        emailCache.current.set(email, result);
        lastCheckedEmail.current = email;

        setTrainerInfo(result);
      } catch (error) {
        console.error('Error checking email:', error);
        setTrainerInfo(null);
      } finally {
        setCheckingEmail(false);
      }
    },
    [checkTrainerEmail, validateEmail]
  );

  const clearCache = useCallback(() => {
    emailCache.current.clear();
    lastCheckedEmail.current = '';
    setTrainerInfo(null);
  }, []);

  // Debounce function
  const checkEmail = useCallback(
    (email: string) => {
      // Limpar timeout anterior
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Só fazer check se o email for válido e diferente do último verificado
      if (validateEmail(email) && email !== lastCheckedEmail.current) {
        debounceTimeoutRef.current = setTimeout(() => {
          performEmailCheck(email);
        }, debounceMs);
      } else if (!validateEmail(email)) {
        // Limpar info se email não for válido
        setTrainerInfo(null);
        lastCheckedEmail.current = '';
      }
    },
    [performEmailCheck, validateEmail, debounceMs]
  );

  return {
    trainerInfo,
    checkingEmail,
    isValidEmail: false, // Será calculado no componente pai
    checkEmail,
    clearCache,
  };
};
