import { Clinician, Patient } from '../../types';

export const sally: Omit<Patient, 'password'> = {
  id: 1,
  name: 'Sally Johnson',
  email: 'sallyj@uci.edu',
  // taperingConfigurations: [
  //   {
  //     id: 1,
  //     clinicianId: 1,
  //     patientId: 1,
  //     createdAt: new Date(),
  //     prescribedDrugs: [
  //       {
  //         name: 'Fluoxetine',
  //         brand: 'Prozac',
  //         form: 'capsule',
  //         currentDosages: [{ dosage: '10mg', quantity: 1 }, { dosage: '20mg', quantity: 2 }],
  //         nextDosages: [{ dosage: '20mg', quantity: 2 }],
  //       },
  //       {
  //         name: 'Citalopram',
  //         brand: 'Celexa',
  //         form: 'tablet',
  //         currentDosages: [{ dosage: '10mg', count: 1 }],
  //         nextDosages: [{ dosage: '20mg', count: 1 }],
  //       },
  //     ],
  //   },
  // ] as TaperingConfiguration[],
  taperingConfiguration: null,
  recentVisit: new Date(),
  notes: '',
};

export const john: Omit<Patient, 'password'> = {
  id: 2,
  name: 'John Greenberg',
  email: 'johng@uci.edu',
  notes: '',
  taperingConfiguration: null,
  recentVisit: new Date('2021-05-14T21:13:39.673Z'),
};

export const xiao: Omit<Patient, 'password'> = {
  id: 3,
  email: 'xiaoz@uci.edu',
  name: 'Xiao Zhang',
  taperingConfiguration: null,
  recentVisit: new Date(),
  notes: '',
};

export const christian: Omit<Clinician, 'password'> = {
  email: 'clinician@gmail.com',
  name: 'Christian Lee',
  id: 1,
  patients: [
    { id: sally.id, name: sally.name },
    { id: john.id, name: john.name },
  ],
};
