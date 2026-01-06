import React from 'react';
import { useForm } from 'react-hook-form';
import { createEmployee } from './api';

export default function EmployeeForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    try {
      await createEmployee(data);
      alert('Employee created');
    } catch (e) {
      alert('Error creating employee');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div><label>First Name</label><input {...register('firstName')} /></div>
      <div><label>Last Name</label><input {...register('lastName')} /></div>
      <div><label>Email</label><input {...register('email')} /></div>
      <div><label>Role</label><input {...register('role')} /></div>
      <div><label>Hire Date</label><input type="date" {...register('hireDate')} /></div>
      <div><label>Salary</label><input type="number" step="0.01" {...register('salary')} /></div>
      <button type="submit">Create</button>
    </form>
  );
}
