'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { QuizCreateFormValues } from '@/lib/schemas';
import { useFieldArray } from 'react-hook-form';

export default function QuestionEditor({
  form,
  index,
}: {
  form: UseFormReturn<QuizCreateFormValues>;
  index: number;
}) {
  const q = form.watch(`questions.${index}`);
  const errors = form.formState.errors;

  return (
    <div className='mt-3'>
      <label className='block text-sm font-medium text-gray-700'>
        Question text
        <input
          {...form.register(`questions.${index}.text` as const)}
          className='mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          placeholder='Type your question…'
        />
      </label>

      <div className='mt-3 text-sm text-gray-500'>
        <span className='font-medium text-gray-700'>Type:</span> {q.type}
      </div>

      {q.type === 'boolean' && (
        <div className='mt-4'>
          <div className='text-sm font-medium text-gray-700'>
            Correct answer
          </div>

          <div className='mt-2 flex flex-wrap gap-4'>
            <label className='inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm'>
              <input
                type='radio'
                value='true'
                checked={q.correctBoolean === true}
                onChange={() =>
                  form.setValue(`questions.${index}.correctBoolean`, true)
                }
                className='h-4 w-4'
              />
              True
            </label>

            <label className='inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm'>
              <input
                type='radio'
                value='false'
                checked={q.correctBoolean === false}
                onChange={() =>
                  form.setValue(`questions.${index}.correctBoolean`, false)
                }
                className='h-4 w-4'
              />
              False
            </label>
          </div>
        </div>
      )}

      {q.type === 'input' && (
        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Correct answer
            <input
              {...form.register(`questions.${index}.correctText` as const)}
              className='mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              placeholder='Type the correct answer…'
            />
          </label>

          {errors.questions?.[index] &&
            (errors.questions[index] as { correctText?: { message?: string } })
              ?.correctText && (
              <p className='mt-2 text-sm text-red-600'>
                {
                  (
                    errors.questions[index] as {
                      correctText?: { message?: string };
                    }
                  )?.correctText?.message
                }
              </p>
            )}
        </div>
      )}

      {q.type === 'checkbox' && <CheckboxOptions form={form} index={index} />}
    </div>
  );
}

function CheckboxOptions({
  form,
  index,
}: {
  form: UseFormReturn<QuizCreateFormValues>;
  index: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `questions.${index}.options` as const,
  });

  const optionsErr = (
    form.formState.errors.questions?.[index] as {
      options?: { message?: string };
    }
  )?.options;

  return (
    <div className='mt-4'>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold text-gray-900'>Options</div>

        <button
          type='button'
          onClick={() => append({ text: '', isCorrect: false })}
          className='rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50'
        >
          + option
        </button>
      </div>

      {typeof optionsErr?.message === 'string' && (
        <p className='mt-2 text-sm text-red-600'>{optionsErr.message}</p>
      )}

      <div className='mt-3 grid gap-3'>
        {fields.map((f, optIdx) => (
          <div
            key={f.id}
            className='grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm'
          >
            <input
              type='checkbox'
              {...form.register(
                `questions.${index}.options.${optIdx}.isCorrect` as const
              )}
              className='h-4 w-4'
              title='Mark as correct'
            />

            <input
              placeholder={`Option ${optIdx + 1}`}
              {...form.register(
                `questions.${index}.options.${optIdx}.text` as const
              )}
              className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            />

            <button
              type='button'
              onClick={() => remove(optIdx)}
              className='rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900'
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
