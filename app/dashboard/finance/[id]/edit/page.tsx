import Form from '@/app/ui/employees/edit-form';
import Breadcrumbs from '@/app/ui/employees/breadcrumbs';
import { fetchEmployeeById } from '@/app/lib/employees/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Employee',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const employee = await fetchEmployeeById(id);

  if (!employee) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Employees', href: '/dashboard/employees' },
          {
            label: 'Edit Employee',
            href: `/dashboard/employees/${id}/edit`,
            active: true,
          },
        ]}
      />
      pagina
      <Form employee={employee} />
    </main>
  );
}