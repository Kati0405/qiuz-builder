'use client';

import { QuizCreateFormValues, quizCreateSchema } from '@/lib/schemas';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { apiCreateQuiz } from '@/lib/api';
import QuestionEditor from './QuestionEditor';

export default function QuizForm() {
  const router = useRouter();

  const form = useForm<QuizCreateFormValues>({
    resolver: zodResolver(quizCreateSchema),
    defaultValues: {
      title: '',
      questions: [{ type: 'boolean', text: '', correctBoolean: true }],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const addQuestion = (
    type: QuizCreateFormValues['questions'][number]['type']
  ) => {
    if (type === 'boolean')
      append({ type: 'boolean', text: '', correctBoolean: true });
    if (type === 'input') append({ type: 'input', text: '', correctText: '' });
    if (type === 'checkbox')
      append({
        type: 'checkbox',
        text: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      });
  };

  const onSubmit = async (values: QuizCreateFormValues) => {
    const created = await apiCreateQuiz(values);
    router.push(`/quizzes/${created.id}`);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mx-auto max-w-4xl px-6 py-8'
    >
      <h1 className='text-2xl font-semibold text-gray-900'>Create Quiz</h1>

      <div className='mt-6'>
        <label className='block text-sm font-medium text-gray-700'>
          Title
          <input
            {...register('title')}
            className='mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            placeholder='e.g. JavaScript basics'
          />
        </label>

        {errors.title && (
          <p className='mt-2 text-sm text-red-600'>{errors.title.message}</p>
        )}
      </div>

      <div className='mt-6 flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={() => addQuestion('boolean')}
          className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50'
        >
          + Boolean
        </button>

        <button
          type='button'
          onClick={() => addQuestion('input')}
          className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50'
        >
          + Input
        </button>

        <button
          type='button'
          onClick={() => addQuestion('checkbox')}
          className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50'
        >
          + Checkbox
        </button>
      </div>

      {errors.questions && typeof errors.questions.message === 'string' && (
        <p className='mt-3 text-sm text-red-600'>{errors.questions.message}</p>
      )}

      <div className='mt-8 grid gap-4'>
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'
          >
            <div className='flex items-center justify-between gap-3'>
              <strong className='text-sm font-semibold text-gray-900'>
                Question #{idx + 1}
              </strong>

              <button
                type='button'
                onClick={() => remove(idx)}
                className='rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900'
              >
                Remove
              </button>
            </div>

            <div className='mt-4'>
              <QuestionEditor form={form} index={idx} />
            </div>

            {errors.questions?.[idx]?.text && (
              <p className='mt-2 text-sm text-red-600'>
                {errors.questions[idx]?.text?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='mt-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? 'Saving...' : 'Create quiz'}
      </button>
    </form>
  );
}
