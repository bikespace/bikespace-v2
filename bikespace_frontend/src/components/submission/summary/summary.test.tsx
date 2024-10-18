import React from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {render, screen, fireEvent} from '@testing-library/react';
import {faker} from '@faker-js/faker';

import {SubmissionSchema} from '../schema';
import {formOrder} from '../constants';

import {ParkingDuration, IssueType} from '@/interfaces/Submission';

import {SubmissionFormController} from '../submission-form-controller';

import {Summary} from './Summary';

interface WrapperProps {
  onSubmit?: () => void;
}

const MockForm = ({onSubmit = jest.fn()}: WrapperProps) => {
  const form = useForm<SubmissionSchema>({
    defaultValues: {
      issues: [IssueType.Damaged],
      location: {
        // default location is the City Hall
        latitude: 43.65322,
        longitude: -79.384452,
      },
      parkingTime: {
        date: new Date(),
        parkingDuration: ParkingDuration.Minutes,
      },
      comments: '',
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Summary />
        <SubmissionFormController
          step={formOrder.length - 1}
          setStep={jest.fn()}
        />
      </form>
    </FormProvider>
  );
};

jest.mock('next/navigation', () => ({
  useRouter() {
    return {};
  },
}));

describe('Summary', () => {
  beforeEach(() => {
    faker.seed(123);
  });

  test('Summary text should render correctly', () => {
    render(<MockForm />);

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(
      'Summary'
    );
    expect(screen.getByText(/Issues:/i));
    expect(screen.getByText(/Location:/i));
    expect(screen.getByText(/Time:/i));
    expect(screen.getByText(/Parking duration needed:/i));
    expect(screen.getByText(/Comments:/i));
  });

  test('Success response status should render correct message', () => {
    render(<MockForm />);

    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(
      'Success'
    );
  });

  test('Error response status should render correct message', () => {
    render(<MockForm />);

    expect(
      screen.getByText(
        /Something went wrong on our end processing your submission/
      )
    );
  });

  test('Unexpected response status should render correct message', () => {
    render(<MockForm />);

    expect(screen.getByText(/Something went wrong beyond our expectations/));
  });
});
