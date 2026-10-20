import { useCallback, useEffect, useState } from 'react';
import { boardRepository } from '../data/board-repository.js';

export function useBoard() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBoard(await boardRepository.getBoard());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo abrir el tablero.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const perform = useCallback(async (operation, payload) => {
    setSaving(true);
    setError('');
    try {
      const nextBoard = await boardRepository[operation](payload);
      setBoard(nextBoard);
      return true;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudo guardar el cambio.';
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { board, loading, saving, error, clearError, refresh, perform };
}
