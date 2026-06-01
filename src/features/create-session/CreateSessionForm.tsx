'use client';

// ============================================================
// CreateSessionForm — Landing page form
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { createSessionSchema, type CreateSessionInput } from '@/validators/session.validator';
import { createSession } from '@/services/api/session.service';
import type { CreateSessionResponse } from '@/types/session.types';
import { Button } from '@/components/ui/Button';
import styles from './CreateSessionForm.module.scss';

interface CreateSessionFormProps {
  onSuccess: (data: CreateSessionResponse) => void;
}

export function CreateSessionForm({ onSuccess }: CreateSessionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  const nameValue = watch('ownerName', '');

  const onSubmit = async (data: CreateSessionInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await createSession(data.ownerName);
      onSuccess(result);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
    >
      <div className={styles.field}>
        <label htmlFor="ownerName" className={styles.label}>
          What&apos;s your name?
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="ownerName"
            type="text"
            placeholder="e.g. Alex Johnson"
            autoComplete="name"
            autoFocus
            aria-describedby={errors.ownerName ? 'name-error' : undefined}
            className={`${styles.input} ${errors.ownerName ? styles.inputError : ''}`}
            {...register('ownerName')}
          />
          <AnimatePresence>
            {nameValue.length > 0 && !errors.ownerName && (
              <motion.span
                className={styles.checkmark}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {errors.ownerName && (
            <motion.p
              id="name-error"
              className={styles.error}
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.ownerName.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.div
            className={styles.serverError}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isLoading}
        id="create-session-btn"
      >
        ✨ Create My Appreciation Page
      </Button>

      <p className={styles.hint}>Free · Anonymous · Expires in 48 hours</p>
    </motion.form>
  );
}
